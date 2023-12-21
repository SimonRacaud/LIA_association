<?php

namespace App\Http\Controllers\Api;

use App\Models\UserRole;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use App\Http\Controllers\API\BaseController;
use App\Http\Resources\UserResource;

use App\Models\User;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UsersController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $size = $request->query('size');
            $list = User::paginate($size == null ? 10 : $size);

            return $this->sendCollection(
                UserResource::collection($list),
                intval($request->query('page')),
                $size,
                User::count(),
            );
        } catch (\Exception $exception) {
            return $this->sendError(ErrorMessage::FAILURE, $exception->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $user = User::find($id);

            if (is_null($user)) {
                return $this->sendError(ErrorMessage::NOT_FOUND, "User not found", 404);
            }

            return $this->sendResponse(new UserResource($user));
        } catch (\Exception $exception) {
            return $this->sendError(ErrorMessage::FAILURE, $exception->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $user = User::findOrFail($id);
            $data = $request->validate([
                'username' => [Rule::unique('users')->ignore($user->id, 'id'), 'max:255'],
                'email' => ['email', Rule::unique('users')->ignore($user->id, 'id')],
                'password' => 'min:8',
                'role' => [Rule::in(array_column(UserRole::cases(), 'value'))],
            ]);

            if (array_key_exists('password', $data)) {
                $data['password'] = bcrypt($data['password']);
            }
            $user->update($data);

            return $this->sendResponse(new UserResource($user));
        } catch (ValidationException $exception) {
            return $this->sendError(ErrorMessage::VALIDATION_ERR, $exception->getMessage(), 400);
        } catch (ModelNotFoundException $exception) {
            return $this->sendError(ErrorMessage::NOT_FOUND, $exception->getMessage(), 404);
        } catch (\Exception $exception) {
            return $this->sendError(ErrorMessage::FAILURE, $exception->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            User::findOrFail($id)->delete();

            return response()->json(null, 204);
        } catch (ModelNotFoundException $exception) {
            return $this->sendError(ErrorMessage::NOT_FOUND, $exception->getMessage(), 404);
        } catch (\Exception $exception) {
            return $this->sendError(ErrorMessage::FAILURE, $exception->getMessage(), 500);
        }
    }
}
