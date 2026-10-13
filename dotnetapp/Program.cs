// using dotnetapp.Data;
// using dotnetapp.Models;
// using dotnetapp.Services;
// using Microsoft.AspNetCore.Authentication.JwtBearer;
// using Microsoft.AspNetCore.Identity;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.IdentityModel.Tokens;
// using System.Text;
// using Azure.Identity; // for DefaultAzureCredential if using Azure SDKs

// var builder = WebApplication.CreateBuilder(args);

// // Configure DbContext - replace with your connection string
// var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
//                       ?? builder.Configuration["ConnectionStrings:DefaultConnection"];
// /*if (string.IsNullOrEmpty(connectionString))
// {
//     // NOTE: In production, do not store secrets in plain text. Use KeyVault.
//     connectionString = "User ID=sa;password=examlyMssql@123;server=localhost;Database=appdb;trusted_connection=false;Persist Security Info=False;Encrypt=False";
// }*/

// builder.Services.AddDbContext<ApplicationDbContext>(options =>
//     options.UseSqlServer(connectionString));


// // Identity
// builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
// {
//     options.Password.RequireDigit = true;
//     options.Password.RequireLowercase = true;
//     options.Password.RequireUppercase = false;
//     options.Password.RequireNonAlphanumeric = false;
//     options.Password.RequiredLength = 6;
// })
//     .AddEntityFrameworkStores<ApplicationDbContext>()
//     .AddDefaultTokenProviders();


// // JWT Authentication
// var jwtSection = builder.Configuration.GetSection("JWT");
// var secret = jwtSection["Secret"];
// var issuer = jwtSection["ValidIssuer"];
// var audience = jwtSection["ValidAudience"];

// if (string.IsNullOrEmpty(secret))
// {
//     // In dev, we continue but in prod you must configure JWT:Secret via KeyVault or environment.
//     builder.Logging.AddDebug();
// }

// builder.Services.AddAuthentication(options =>
// {
//     options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//     options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
// })
// .AddJwtBearer(options =>
// {
//     options.RequireHttpsMetadata = false;
//     options.SaveToken = true;
//     options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
//     {
//         ValidateIssuer = true,
//         ValidateAudience = true,
//         ValidAudience = audience,
//         ValidIssuer = issuer,
//         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret))
//     };
// });

// // Add application services
// builder.Services.AddScoped<IAuthService, AuthService>();
// builder.Services.AddScoped<PlaceService>();

// builder.Services.AddControllers();
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

// // Add CORS policy
//  //https://8080-ddebfeecebbcbabbcefdfbcaeccc.premiumproject.examly.io
//  //.WithOrigins("https://8081-ddebfeecebbcbabbcefdfbcaeccc.premiumproject.examly.io/")
// // Add CORS policy
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowFrontend", policy =>
//     {
//         policy
//           .AllowAnyOrigin()
//             .AllowAnyMethod()
//             .AllowAnyHeader();
//             // If you send cookies (SameSite=None) or use Authorization header with bearer tokens in a cross-site scenario,
//             // enable credentials. NOTE: WithCredentials requires a specific origin (no '*').
//            // .AllowCredentials();
//     });
// });


// // Use DefaultAzureCredential - example usage comment
// // If you want to load secrets from Key Vault, do something like:
// // var credential = new DefaultAzureCredential();
// // var kvUri = builder.Configuration["KeyVaultConfiguration:URL"];
// // if(!string.IsNullOrEmpty(kvUri)) {
// //     builder.Configuration.AddAzureKeyVault(new Uri(kvUri), credential);
// // }
// // Make sure DefaultAzureCredential works in your environment (AZURE_* env vars or managed identity).

// var app = builder.Build();



// if (app.Environment.IsDevelopment())
// {
//     app.UseDeveloperExceptionPage();
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

// app.UseHttpsRedirection();
// app.UseCors("AllowFrontend");
// app.UseAuthentication();
// app.UseAuthorization();

// app.MapControllers();

// // Ensure DB created & seed roles
// using (var scope = app.Services.CreateScope())
// {
//     var services = scope.ServiceProvider;
//     var db = services.GetRequiredService<ApplicationDbContext>();
//     db.Database.Migrate();

//     var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
//     if (!await roleManager.RoleExistsAsync(UserRoles.Guide))
//         await roleManager.CreateAsync(new IdentityRole(UserRoles.Guide));
//     if (!await roleManager.RoleExistsAsync(UserRoles.Traveller))
//         await roleManager.CreateAsync(new IdentityRole(UserRoles.Traveller));
// }

// app.Run();

using dotnetapp.Data;
using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Serilog;
using Azure.Identity;

var builder = WebApplication.CreateBuilder(args);
// --- SERILOG CONFIGURATION START (Modified to use MinimumLevel.Override) ---
var logger = new LoggerConfiguration()
    // Base logging level for everything is Information
    .MinimumLevel.Is(Serilog.Events.LogEventLevel.Information) // <--- NEW / MODIFIED LINE
    
    // Override verbosity for specific noisy components to clean console/logs
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore", Serilog.Events.LogEventLevel.Warning) // <--- NEW / MODIFIED LINE: Suppress verbose DB logs
    .MinimumLevel.Override("Microsoft.AspNetCore.Hosting", Serilog.Events.LogEventLevel.Warning) // <--- NEW / MODIFIED LINE: Suppress detailed hosting logs
    .MinimumLevel.Override("Microsoft.AspNetCore.Routing", Serilog.Events.LogEventLevel.Warning) // <--- NEW / MODIFIED LINE
    .MinimumLevel.Override("Microsoft.AspNetCore.Mvc", Serilog.Events.LogEventLevel.Warning) // <--- NEW / MODIFIED LINE
    .MinimumLevel.Override("dotnetapp", Serilog.Events.LogEventLevel.Debug) // <--- NEW / MODIFIED LINE: Keep our application logs visible
    
    // NOTE: Removed .ReadFrom.Configuration(builder.Configuration) since overrides are explicit here.
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File(
        path: "Models/logs/activity_log-.txt",
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {SourceContext} - {Message:lj}{NewLine}{Exception}",
        rollingInterval: RollingInterval.Day,
        restrictedToMinimumLevel: Serilog.Events.LogEventLevel.Information
    )
    .WriteTo.File(
        path: "Models/logs/error_log-.txt",
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {SourceContext} - {Message:lj}{NewLine}{Exception}",
        rollingInterval: RollingInterval.Day,
        restrictedToMinimumLevel: Serilog.Events.LogEventLevel.Error
    )
    .CreateLogger();

builder.Logging.ClearProviders();
builder.Host.UseSerilog(logger);
// --- SERILOG CONFIGURATION END ---
// Configure DbContext - replace with your connection string
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
   ?? builder.Configuration["ConnectionStrings:DefaultConnection"];
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "Configure ConnectionStrings:DefaultConnection using an environment variable.");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
options.UseSqlServer(connectionString));

// Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
options.Password.RequireDigit = true;
options.Password.RequireLowercase = true;
options.Password.RequireUppercase = false;
options.Password.RequireNonAlphanumeric = false;
options.Password.RequiredLength = 6;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// JWT Authentication
var jwtSection = builder.Configuration.GetSection("JWT");
var secret = jwtSection["Secret"];
var issuer = jwtSection["ValidIssuer"];
var audience = jwtSection["ValidAudience"];

if (string.IsNullOrWhiteSpace(secret))
{
    throw new InvalidOperationException(
        "Configure JWT:Secret using an environment variable.");
}

builder.Services.AddAuthentication(options =>
{
options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
options.RequireHttpsMetadata = false;
options.SaveToken = true;
options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
{
ValidateIssuer = true,
ValidateAudience = true,
ValidAudience = audience,
ValidIssuer = issuer,
IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret))
};
});

// Add application services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<PlaceService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS policy
builder.Services.AddCors(options =>
{
options.AddPolicy("AllowFrontend", policy =>
{
policy
 .AllowAnyOrigin()
.AllowAnyMethod()
.AllowAnyHeader();
});
});

var app = builder.Build();

app.Lifetime.ApplicationStopped.Register(Log.CloseAndFlush);

if (app.Environment.IsDevelopment())
{
app.UseDeveloperExceptionPage();
app.UseSwagger();
app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Ensure DB created & seed roles
using (var scope = app.Services.CreateScope())
{
var services = scope.ServiceProvider;
var db = services.GetRequiredService<ApplicationDbContext>();
db.Database.Migrate();

var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
if (!await roleManager.RoleExistsAsync(UserRoles.Guide))
await roleManager.CreateAsync(new IdentityRole(UserRoles.Guide));
if (!await roleManager.RoleExistsAsync(UserRoles.Traveller))
await roleManager.CreateAsync(new IdentityRole(UserRoles.Traveller));
}

app.Run();