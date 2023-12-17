<?php

namespace App\Http\Middleware;

use App\Models\UserRole;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if(Auth::check()) {
            if(Auth::user()->role == UserRole::ADMIN){
                return $next($request);
            } else {
                return response()->json([ 'message' => 'access restricted to administrator'], 403);
            }
        }
        return response()->json([ 'message' => 'access denied'], 403);
    }
}
