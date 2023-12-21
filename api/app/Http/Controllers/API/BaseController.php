<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller as Controller;
use Illuminate\Http\JsonResponse;

enum ErrorMessage: string
{
    case VALIDATION_ERR = 'Validation Error';
    case BODY_ERR = 'Body Error';
    case FAILURE = 'Failure';
    case NOT_FOUND = 'Not found';
    case DENIED = "Access denied";
};

class BaseController extends Controller
{
    /**
     * success response method.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendResponse($result): JsonResponse
    {
        return response()->json($result, 200);
    }

    /**
     * Success response, return a paginated collection
     * @param $data
     * @param $page
     * @param $size
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendCollection($data, $page, $size, $count): JsonResponse
    {
        $maxPage = 0;
        if ($size > 0) { // Prevent div by 0
            $maxPage = ceil($count / $size);
        }

        return $this->sendResponse([
            'data' => $data,
            'page' => ($page == 0) ? 1 : $page,
            'max' => ($maxPage == 0) ? 1 : $maxPage,
        ]);
    }

    /**
     * return error response.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendError(ErrorMessage $error, string $errorMessage = '', $code = 404): JsonResponse
    {
    	$response = [
            'message' => $error,
        ];

        if(!empty($errorMessage)){
            $response['data'] = $errorMessage;
        }

        return response()->json($response, $code);
    }
}
