<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\API\BaseController;
use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class EventController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $size = $request->query('size');

            $list = Event::paginate($size == null ? 10 : $size);
            return $this->sendCollection(
                EventResource::collection($list),
                intval($request->query('page')),
                $size,
                Event::count(),
            );
        } catch (\Exception $exception) {
            return $this->sendError("Failure", [$exception->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $data = $request->validate(Event::$validation);

            $data['date'] =
                \DateTime::createFromFormat("d/m/Y", $data['date'])
                    ->format('Y-m-d');

            $result = Event::create($data);

            return $this->sendResponse(new EventResource($result));
        } catch (ValidationException $exception) {
            return $this->sendError('Validation error. ', $exception->errors(), 400);
        } catch (\Exception $exception) {
            return $this->sendError("Failure", [$exception->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $uuid)
    {
        try {
            $data = Event::find($uuid);
            if (is_null($data)) {
                return $this->sendError('Event not found');
            }
            return $this->sendResponse(new EventResource($data));
        } catch (\Exception $exception) {
            return $this->sendError("Failure", [$exception->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $uuid)
    {
        try {
            $data = Event::findOrFail($uuid);
            $newData = $request->validate(Event::$validationUpdate);
            if (key_exists('date', $newData)) {
                $newData['date'] =
                    \DateTime::createFromFormat("d/m/Y", $newData['date'])
                        ->format('Y-m-d');
            }
            $data->update($newData);
            return $this->sendResponse(new EventResource($data));
        } catch (ValidationException $exception) {
            return $this->sendError('Validation error. ', $exception->errors(), 400);
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Not found", [], 404);
        } catch (\Exception $exception) {
            return $this->sendError("Failure", [$exception->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $uuid)
    {
        try {
            Event::findOrFail($uuid)->delete();

            return response()->json(null, 204);
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Not found", [], 404);
        } catch (\Exception $exception) {
            return $this->sendError("Failure", [$exception->getMessage()], 500);
        }
    }
}
