<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller as Controller;

class BaseController extends Controller
{
    /**
     * success response method.
     *
     * @return \Illuminate\Http\Response
     */
    public function sendResponse($result)
    {
        return response()->json($result, 200);
    }

    /**
     * Success response, return a paginated collection
     * @param $data
     * @param $page
     * @param $size
     * @return \Illuminate\Http\Response
     */
    public function sendCollection($data, $page, $size, $count)
    {
        $maxPage = 0;
        if ($size > 0) { // Prevent div by 0
            $maxPage = ceil($count / $size);
        }

        return $this->sendResponse([
            'data' => $data,
            'page' => ($page == 0) ? 1 : $page,
            'max' => $maxPage,
        ]);
    }

    /**
     * return error response.
     *
     * @return \Illuminate\Http\Response
     */
    public function sendError($error, $errorMessages = [], $code = 404)
    {
    	$response = [
            'message' => $error,
        ];

        if(!empty($errorMessages)){
            $response['data'] = $errorMessages;
        }

        return response()->json($response, $code);
    }
}
