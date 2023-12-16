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
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate(User::$validation);

            $input = $validated;
            $input['password'] = bcrypt($input['password']);
            $user = User::create($input);
            $success['token'] =  $user->createToken(self::APP_NAME)->plainTextToken;
            $success['name'] =  $user->name;

            return $this->sendResponse($success);
        } catch (ValidationException $exception) {
            return $this->sendError('Validation Error.', $exception->errors());
        }
    }

    /**
     * Login api
     *
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request): JsonResponse
    {
        if(Auth::attempt(['name' => $request->name, 'password' => $request->password])){
            $user = Auth::user();
            $success['token'] =  $user->createToken(self::APP_NAME)->plainTextToken;
            $success['name'] =  $user->name;

            return $this->sendResponse($success);
        }
        else{
            return $this->sendError('Unauthorised.', ['error'=>'Unauthorised']);
        }
    }
}
