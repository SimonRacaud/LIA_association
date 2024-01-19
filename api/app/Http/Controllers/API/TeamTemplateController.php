<?php

namespace App\Http\Controllers\API;

use App\Http\Resources\TeamTemplateResource;
use App\Models\TeamTemplate;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class TeamTemplateController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $size = $request->query('size');

            $list = TeamTemplate::paginate($size == null ? 10 : $size);
            return $this->sendCollection(
                TeamTemplateResource::collection($list),
                intval($request->query('page')),
                $size,
                TeamTemplate::count(),
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
            $data = $request->validate(TeamTemplate::validation());
            $result = TeamTemplate::create($data);

            return $this->sendResponse(new TeamTemplateResource($result));
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
            $data = TeamTemplate::find($uuid);
            if (is_null($data)) {
                return $this->sendError(ErrorMessage::NOT_FOUND, "Template not found", 404);
            }
            return $this->sendResponse(new TeamTemplateResource($data));
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
            $data = TeamTemplate::findOrFail($uuid);
            $newData = $request->validate(TeamTemplate::validationUpdate($uuid));
            $data->update($newData);
            return $this->sendResponse(new TeamTemplateResource($data));
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
            TeamTemplate::findOrFail($uuid)->delete();

            return response()->json(null, 204);
        } catch (ModelNotFoundException $e) {
            return $this->sendError(ErrorMessage::NOT_FOUND, $e->getMessage(), 404);
        } catch (\Exception $exception) {
            return $this->sendError(ErrorMessage::FAILURE, $exception->getMessage(), 500);
        }
    }
}
