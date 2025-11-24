<?php

use Illuminate\Support\Facades\Route;

// Authentication Controllers
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ProfileController;

// Core Controllers
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\UserAccessController;
use App\Http\Controllers\AuditLogController;

// Module Controllers
use App\Http\Controllers\BranchController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProductionTaskController;
use App\Http\Controllers\ProjectFileController;
use App\Http\Controllers\ReportController;

// Service Controllers
use App\Http\Controllers\PackageController;
use App\Http\Controllers\ClothController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\CategoryController;

// Public Routes
Route::post('/login', [LoginController::class, 'login'])->name('login');
Route::post('/register', [RegisterController::class, 'register']);

// Protected Routes (Sanctum Authentication Required)
Route::middleware(['auth:sanctum'])->group(function () {

    // User Profile
    Route::get('/me', [ProfileController::class, 'me']);
    Route::post('/logout', [LogoutController::class, 'logout']);

    // Users Management (Admin / SuperAdmin)
    Route::middleware(['role:SuperAdmin|Admin'])->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
    // Roles and Permissions (SuperAdmin only)
    Route::middleware(['role:SuperAdmin'])->group(function () {
        // Roles - GET routes (view) accessible to SuperAdmin or Admin
        Route::middleware(['role:SuperAdmin|Admin'])->group(function () {
            Route::get('/roles', [RoleController::class, 'index']);
            Route::get('/roles/{id}', [RoleController::class, 'show']);
        });

        // Create role
        Route::post('/roles', [RoleController::class, 'store']);

        // Update / Delete require specific permission
        Route::middleware(['permission:roles.manage'])->group(function () {
            Route::put('/roles/{id}', [RoleController::class, 'update']);
            Route::delete('/roles/{id}', [RoleController::class, 'destroy']);
        });

        // Assign / remove permissions to roles
        Route::post('/roles/{id}/permissions', [RoleController::class, 'assignPermissions']);
        Route::delete('/roles/{id}/permissions/{permissionId}', [RoleController::class, 'removePermission']);
    });

    // Permissions (system permissions access)
    Route::get('/permissions', [PermissionController::class, 'index']);
    Route::post('/permissions', [PermissionController::class, 'store']);
    Route::get('/permissions/{id}', [PermissionController::class, 'show']);
    Route::put('/permissions/{id}', [PermissionController::class, 'update']);
    Route::delete('/permissions/{id}', [PermissionController::class, 'destroy']);

    // Audit Logs
    Route::get('/audit', [AuditLogController::class, 'index']);

    // User Role and Permission Assignment
    Route::middleware(['role:SuperAdmin|Admin'])->group(function () {
        Route::get('/users/{user}/permissions', [UserAccessController::class, 'getPermissions']);
        Route::post('/users/{user}/roles', [UserAccessController::class, 'assignRole']);
        Route::delete('/users/{user}/roles/{role}', [UserAccessController::class, 'removeRole']);
        Route::post('/users/{user}/permissions', [UserAccessController::class, 'givePermission']);
        Route::delete('/users/{user}/permissions/{permission}', [UserAccessController::class, 'revokePermission']);
    });

    // Operational Modules

    // Branches
    Route::middleware(['permission:branches.view'])->group(function () {
        Route::get('/branches', [BranchController::class, 'index']);
        Route::get('/branches/{id}', [BranchController::class, 'show']);
    });

    Route::middleware(['permission:branches.manage'])->group(function () {
        Route::post('/branches', [BranchController::class, 'store']);
        Route::put('/branches/{id}', [BranchController::class, 'update']);
        Route::delete('/branches/{id}', [BranchController::class, 'destroy']);
    });

    // Clients
    Route::middleware(['permission:clients.view'])->group(function () {
        Route::get('/clients', [ClientController::class, 'index']);
        Route::get('/clients/{id}', [ClientController::class, 'show']);
    });

    Route::middleware(['permission:clients.manage'])->group(function () {
        Route::post('/clients', [ClientController::class, 'store']);
        Route::put('/clients/{id}', [ClientController::class, 'update']);
        Route::delete('/clients/{id}', [ClientController::class, 'destroy']);
    });

    // Projects
    Route::middleware(['permission:projects.view'])->group(function () {
        Route::get('/projects', [ProjectController::class, 'index']);
        Route::get('/projects/{id}', [ProjectController::class, 'show']);
    });

    Route::middleware(['permission:projects.manage'])->group(function () {
        Route::post('/projects', [ProjectController::class, 'store']);
        Route::put('/projects/{id}', [ProjectController::class, 'update']);
        Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);
    });

    // Production Tasks
    Route::middleware(['permission:production.view'])->group(function () {
        Route::get('/production', [ProductionTaskController::class, 'index']);
    });

    Route::middleware(['permission:production.manage'])->group(function () {
        Route::post('/production', [ProductionTaskController::class, 'store']);
        Route::put('/production/{id}', [ProductionTaskController::class, 'update']);
        Route::delete('/production/{id}', [ProductionTaskController::class, 'destroy']);
    });

    // Project Files
    Route::middleware(['permission:files.upload'])->post('/project-files', [
        ProjectFileController::class,
        'store'
    ]);

    // Reports and KPIs
    Route::middleware(['permission:reports.view'])->group(function () {
        Route::get('/reports/summary', [ReportController::class, 'summary']);
        Route::get('/reports/projects-by-branch', [ReportController::class, 'projectsByBranch']);
        Route::get('/reports/productivity', [ReportController::class, 'productivity']);
    });

    // Categories
    Route::middleware(['permission:categories.manage'])->group(function () {
        Route::get('/categories', [CategoryController::class, 'index']);
        Route::get('/categories/all', [CategoryController::class, 'all']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::get('/categories/{id}', [CategoryController::class, 'show']);
        Route::get('/categories/{id}/subcategories', [CategoryController::class, 'subcategories']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    });

    // Packages
    Route::middleware(['permission:packages.manage'])->group(function () {
        Route::get('/packages', [PackageController::class, 'index']);
        Route::post('/packages', [PackageController::class, 'store']);
        Route::get('/packages/{id}', [PackageController::class, 'show']);
        Route::put('/packages/{id}', [PackageController::class, 'update']);
        Route::delete('/packages/{id}', [PackageController::class, 'destroy']);
    });

    // Clothes
    Route::middleware(['permission:clothes.manage'])->group(function () {
        Route::get('/clothes', [ClothController::class, 'index']);
        Route::post('/clothes', [ClothController::class, 'store']);
        Route::get('/clothes/{id}', [ClothController::class, 'show']);
        Route::put('/clothes/{id}', [ClothController::class, 'update']);
        Route::post('/clothes/{id}', [ClothController::class, 'update']); // Allow POST for updates with files
        Route::delete('/clothes/{id}', [ClothController::class, 'destroy']);
    });

    // Reservations
    Route::middleware(['permission:reservations.manage'])->group(function () {
        Route::get('/reservations', [ReservationController::class, 'index']);
        Route::get('/reservations/calendar', [ReservationController::class, 'calendar']);
        Route::get('/reservations/search/bank-code/{code}', [ReservationController::class, 'searchByBankCode']);
        Route::post('/reservations', [ReservationController::class, 'store']);
        Route::get('/reservations/{id}', [ReservationController::class, 'show']);
        Route::put('/reservations/{id}', [ReservationController::class, 'update']);
        Route::post('/reservations/{id}/transfer-screenshot', [ReservationController::class, 'uploadTransferScreenshot']);
        Route::delete('/reservations/{id}', [ReservationController::class, 'destroy']);
    });
});
