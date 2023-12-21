<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\API\BaseController as BaseController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\JsonResponse;

class RegisterController extends BaseController
{
    const APP_NAME = 'LIA_planning';

    public function __construct(
        protected User $repository,
    ) {
    }

    /**
     * Register api
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate(User::validation());

            $input = $validated;
            $input['password'] = bcrypt($input['password']);
            $user = User::create($input);
            $success['token'] =  $user->createToken(self::APP_NAME)->plainTextToken;
            $success['username'] =  $user->username;

            return $this->sendResponse($success);
        } catch (ValidationException $exception) {
            return $this->sendError(ErrorMessage::VALIDATION_ERR, $exception->getMessage(), 400);
        }
    }

    /**
     * Login api
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        if (Auth::attempt(['username' => $request->username, 'password' => $request->password])){
            $user = Auth::user();
            $success['token'] =  $user->createToken(self::APP_NAME)->plainTextToken;
            $success['username'] =  $user->username;
            $success['role'] =  $user->role;

            return $this->sendResponse($success);
        } else {
            return $this->sendError(ErrorMessage::DENIED, 'Unauthorised', 401);
        }
    }

    /**
     * Logout api
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user('sanctum')->tokens()->delete();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->sendResponse(['message' => 'success']);
    }
}
