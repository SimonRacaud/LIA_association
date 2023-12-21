<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\API\BaseController;
use App\Http\Resources\TeamResource;
use App\Models\Team;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class TeamController extends BaseController
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), Team::validation());
            $data = $validator->validate(); // throw
            // Validate that an event don't have two teams with the same template:
            $validator->addRules(Team::validationUnique($data['event_uuid']));
            $data = $validator->validate(); // throw
            $result = Team::create($data);
            // Attach / detach users:
            $this->manageMembers($data, $result);

            return $this->sendResponse(new TeamResource($result));
        } catch (ValidationException $exception) {
            return $this->sendError(ErrorMessage::VALIDATION_ERR, $exception->getMessage(), 400);
        } catch (\InvalidArgumentException $exception) {
            return $this->sendError(ErrorMessage::BODY_ERR, $exception->getMessage(), $exception->getCode());
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
            $data = Team::findOrFail($uuid);
            // Validation of data
            $validator = Validator::make($request->all(), Team::validationUpdate());
            $newData = $validator->validate(); // throw
            if (key_exists('event_uuid', $newData) || key_exists('template_uuid', $newData)) {
                // Validate that an event don't have two teams with the same template:
                $eventId = (key_exists('event_uuid', $newData)) ? $newData['event_uuid'] : $data->event->uuid;
                $validator->addRules(Team::validationUnique($eventId, $data->uuid));
                $newData = $validator->validate(); // throw
            }
            // Attach users to the team:
            $this->manageMembers($newData, $data);
            //
            $data->update($newData);
            return $this->sendResponse(new TeamResource($data));
        } catch (ValidationException $exception) {
            return $this->sendError(ErrorMessage::VALIDATION_ERR, $exception->getMessage(), 400);
        } catch (\InvalidArgumentException $exception) {
            return $this->sendError(ErrorMessage::BODY_ERR, $exception->getMessage(), $exception->getCode());
        } catch (ModelNotFoundException $e) {
            return $this->sendError(ErrorMessage::NOT_FOUND, "", 404);
        } catch (\Exception $exception) {
            return $this->sendError(ErrorMessage::FAILURE, $exception->getMessage(), 500);
        }
    }

    private function manageMembers(array $newData, Team $data): void
    {
        if (key_exists('members_add', $newData)) {
            foreach ($newData['members_add'] as $uuid) {
                if ($data->members->contains($uuid)) {
                    throw new \InvalidArgumentException("Member id: '$uuid' already attached", 400);
                }
                $data->members()->attach($uuid);
            }
            $data->refresh();
        }
        // Detach users from the team:
        if (key_exists('members_rm', $newData)) {
            foreach ($newData['members_rm'] as $uuid) {
                if (!$data->members->contains($uuid)) {
                    throw new \InvalidArgumentException("'Member id: '.$uuid.' not attached'", 400);
                }
                $data->members()->detach($uuid);
            }
            $data->refresh();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $uuid)
    {
        try {
            Team::findOrFail($uuid)->delete();

            return response()->json(null, 204);
        } catch (ModelNotFoundException $e) {
            return $this->sendError(ErrorMessage::NOT_FOUND, "", 404);
        } catch (\Exception $exception) {
            return $this->sendError(ErrorMessage::FAILURE, $exception->getMessage(), 500);
        }
    }
}
