<?php

namespace App\Http\Controllers\API;

use App\Http\Resources\PlaceResource;
use App\Models\Place;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PlaceController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $size = $request->query('size');

            $list = Place::paginate($size == null ? 10 : $size);
            return $this->sendCollection(
                PlaceResource::collection($list),
                intval($request->query('page')),
                $size,
                Place::count(),
            );
        } catch (\Exception $exception) {
            return $this->sendError(ErrorMessage::FAILURE, $exception->getMessage(), 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $data = $request->validate(Place::$validation);
            $result = Place::create($data);

            return $this->sendResponse(new PlaceResource($result));
        } catch (ValidationException $exception) {
            return $this->sendError(ErrorMessage::VALIDATION_ERR, $exception->getMessage(), 400);
        } catch (\Exception $exception) {
            return $this->sendError(ErrorMessage::FAILURE, $exception->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $uuid)
    {
        try {
            $data = Place::find($uuid);
            if (is_null($data)) {
                return $this->sendError(ErrorMessage::NOT_FOUND, "Place not found", 404);
            }
            return $this->sendResponse(new PlaceResource($data));
        } catch (\Exception $exception) {
            return $this->sendError(ErrorMessage::FAILURE, $exception->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $uuid)
    {
        try {
            $data = Place::findOrFail($uuid);
            $newData = $request->validate(Place::validationUpdate($uuid));
            $data->update($newData);
            return $this->sendResponse(new PlaceResource($data));
        } catch (ValidationException $exception) {
            return $this->sendError(ErrorMessage::VALIDATION_ERR, $exception->getMessage(), 400);
        } catch (ModelNotFoundException $e) {
            return $this->sendError(ErrorMessage::NOT_FOUND, $e->getMessage(), 404);
        } catch (\Exception $exception) {
            return $this->sendError(ErrorMessage::FAILURE, $exception->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $uuid)
    {
        try {
            Place::findOrFail($uuid)->delete();

            return response()->json(null, 204);
        } catch (ModelNotFoundException $e) {
            return $this->sendError(ErrorMessage::NOT_FOUND, $e->getMessage(), 404);
        } catch (\Exception $exception) {
            return $this->sendError(ErrorMessage::FAILURE, $exception->getMessage(), 500);
        }
    }
}
