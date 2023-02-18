import { NextApiRequest, NextApiResponse } from "next";
import test262ReportSummary from "../../../src/test262ReportSummary";

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { path = [] } = request.query as { path?: string[] };
  test262ReportSummary(path).then(
    (data) => {
      response.status(200).json(data);
    },
    (reason) => {
      if (reason.name === "NotFound") {
        response.status(404).json(reason);
      } else {
        response.status(500).json(reason);
      }
    }
  );
}
