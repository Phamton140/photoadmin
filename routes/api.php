<?php

use Illuminate\Support\Facades\Route;

// Auth
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ProfileController;

// Core
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\UserAccessController;
use App\Http\Controllers\AuditLogController;

// New modules
use App\Http\Controllers\BranchController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProductionTaskController;
use App\Http\Controllers\ProjectFileController;
use App\Http\Controllers\ReportController;

// Services module
use App\Http\Controllers\PackageController;
use App\Http\Controllers\ClothController;
use App\Http\Controllers\ReservationController;

// -------------------------------------------------------
// RUTAS PÚBLICAS
// -------------------------------------------------------
Route::post('/login', [LoginController::class, 'login'])->name('login');
Route::post('/register', [RegisterController::class, 'register']);

// -------------------------------------------------------
// RUTAS PROTEGIDAS POR SANCTUM
// -------------------------------------------------------
Route::middleware(['auth:sanctum'])->group(function () {

    // Perfil autenticado
    Route::get('/me', [ProfileController::class, 'me']);
    Route::post('/logout', [LogoutController::class, 'logout']);

    // =====================================================
    // USERS (Admin / SuperAdmin)
    // =====================================================
    Route::middleware(['role:SuperAdmin|Admin'])->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
    // ROLES Y PERMISOS (solo SuperAdmin)
    Route::middleware(['role:SuperAdmin'])->group(function () {
        // Roles - GET routes (view) accessible to SuperAdmin or Admin
        Route::middleware(['role:SuperAdmin|Admin'])->group(function () {
            Route::get('/roles', [RoleController::class, 'index']);
            Route::get('/roles/{id}', [RoleController::class, 'show']);
        });

        // Crear rol
        Route::post('/roles', [RoleController::class, 'store']);

        // Update / Delete require specific permission
        Route::middleware(['permission:roles.manage'])->group(function () {
            Route::put('/roles/{id}', [RoleController::class, 'update']);
            Route::delete('/roles/{id}', [RoleController::class, 'destroy']);
        });

        // Asignar / remover permisos a roles
        Route::post('/roles/{id}/permissions', [RoleController::class, 'assignPermissions']);
        Route::delete('/roles/{id}/permissions/{permissionId}', [RoleController::class, 'removePermission']);
    });

    // Permisos (acceso a permisos del sistema)
    Route::get('/permissions', [PermissionController::class, 'index']);
    Route::post('/permissions', [PermissionController::class, 'store']);
    Route::get('/permissions/{id}', [PermissionController::class, 'show']);
    Route::put('/permissions/{id}', [PermissionController::class, 'update']);
    Route::delete('/permissions/{id}', [PermissionController::class, 'destroy']);

    // Auditoría
    Route::get('/audit', [AuditLogController::class, 'index']);

    // =====================================================
    // ASIGNACIÓN DE ROLES Y PERMISOS A USUARIOS
    // =====================================================
    Route::middleware(['role:SuperAdmin|Admin'])->group(function () {
        Route::get('/users/{user}/permissions', [UserAccessController::class, 'getPermissions']);
        Route::post('/users/{user}/roles', [UserAccessController::class, 'assignRole']);
        Route::delete('/users/{user}/roles/{role}', [UserAccessController::class, 'removeRole']);
        Route::post('/users/{user}/permissions', [UserAccessController::class, 'givePermission']);
        Route::delete('/users/{user}/permissions/{permission}', [UserAccessController::class, 'revokePermission']);
    });

    // =====================================================
    //  MÓDULOS OPERATIVOS
    // =====================================================

    // 🔵 SuCURSALES
    Route::middleware(['permission:branches.view'])->group(function () {
        Route::get('/branches', [BranchController::class, 'index']);
        Route::get('/branches/{id}', [BranchController::class, 'show']);
    });

    Route::middleware(['permission:branches.manage'])->group(function () {
        Route::post('/branches', [BranchController::class, 'store']);
        Route::put('/branches/{id}', [BranchController::class, 'update']);
        Route::delete('/branches/{id}', [BranchController::class, 'destroy']);
    });

    // 🟩 CLIENTES
    Route::middleware(['permission:clients.view'])->group(function () {
        Route::get('/clients', [ClientController::class, 'index']);
        Route::get('/clients/{id}', [ClientController::class, 'show']);
    });

    Route::middleware(['permission:clients.manage'])->group(function () {
        Route::post('/clients', [ClientController::class, 'store']);
        Route::put('/clients/{id}', [ClientController::class, 'update']);
        Route::delete('/clients/{id}', [ClientController::class, 'destroy']);
    });

    // 🟧 PROYECTOS
    Route::middleware(['permission:projects.view'])->group(function () {
        Route::get('/projects', [ProjectController::class, 'index']);
        Route::get('/projects/{id}', [ProjectController::class, 'show']);
    });

    Route::middleware(['permission:projects.manage'])->group(function () {
        Route::post('/projects', [ProjectController::class, 'store']);
        Route::put('/projects/{id}', [ProjectController::class, 'update']);
        Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);
    });

    // 🟪 PRODUCCIÓN / TAREAS
    Route::middleware(['permission:production.view'])->group(function () {
        Route::get('/production', [ProductionTaskController::class, 'index']);
    });

    Route::middleware(['permission:production.manage'])->group(function () {
        Route::post('/production', [ProductionTaskController::class, 'store']);
        Route::put('/production/{id}', [ProductionTaskController::class, 'update']);
        Route::delete('/production/{id}', [ProductionTaskController::class, 'destroy']);
    });

    // 🟫 ARCHIVOS DE PROYECTOS
    Route::middleware(['permission:files.upload'])->post('/project-files', [
        ProjectFileController::class,
        'store'
    ]);

    // 📊 REPORTES Y KPIs
    Route::middleware(['permission:reports.view'])->group(function () {
        Route::get('/reports/summary', [ReportController::class, 'summary']);
        Route::get('/reports/projects-by-branch', [ReportController::class, 'projectsByBranch']);
        Route::get('/reports/productivity', [ReportController::class, 'productivity']);
    });

    // 📦 PAQUETES (Packages)
    Route::middleware(['permission:packages.manage'])->group(function () {
        Route::get('/packages', [PackageController::class, 'index']);
        Route::post('/packages', [PackageController::class, 'store']);
        Route::get('/packages/{id}', [PackageController::class, 'show']);
        Route::put('/packages/{id}', [PackageController::class, 'update']);
        Route::delete('/packages/{id}', [PackageController::class, 'destroy']);
    });

    // 👗 VESTIMENTAS (Clothes)
    Route::middleware(['permission:clothes.manage'])->group(function () {
        Route::get('/clothes', [ClothController::class, 'index']);
        Route::post('/clothes', [ClothController::class, 'store']);
        Route::get('/clothes/{id}', [ClothController::class, 'show']);
        Route::put('/clothes/{id}', [ClothController::class, 'update']);
        Route::delete('/clothes/{id}', [ClothController::class, 'destroy']);
    });

    // 📅 RESERVAS (Reservations)
    Route::middleware(['permission:reservations.manage'])->group(function () {
        Route::get('/reservations', [ReservationController::class, 'index']);
        Route::get('/reservations/calendar', [ReservationController::class, 'calendar']);
        Route::post('/reservations', [ReservationController::class, 'store']);
        Route::get('/reservations/{id}', [ReservationController::class, 'show']);
        Route::put('/reservations/{id}', [ReservationController::class, 'update']);
        Route::delete('/reservations/{id}', [ReservationController::class, 'destroy']);
    });
});
