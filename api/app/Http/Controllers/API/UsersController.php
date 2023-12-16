<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\API\BaseController;
use App\Http\Resources\UserResource;

use App\Models\User;
use Illuminate\Validation\ValidationException;

class UsersController extends BaseController
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $size = $request->query('size');

        $list = User::paginate($size == null ? 10 : $size);
        return $this->sendResponse(UserResource::collection($list));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::find($id);

        if (is_null($user)) {
            return $this->sendError('User not found');
        }

        return $this->sendResponse(new UserResource($user));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $user = User::findOrFail($id);
            $data = $request->validate([
                'username' => 'unique:users|max:255',
                'email' => 'email|unique:users',
                'password' => 'min:8',
                'role' => 'in:ADMIN,MEMBRE'
            ]);

            if (array_key_exists('password', $data)) {
                $data['password'] = bcrypt($data['password']);
            }
            $user->update($data);

            return $this->sendResponse(new UserResource($user));
        } catch (ValidationException $exception) {
            return $this->sendError('Validation Error.', $exception->errors());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        User::findOrFail($id)->delete();

        return response()->json(null, 204);
    }
}
