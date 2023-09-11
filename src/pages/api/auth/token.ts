// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

type RequestDTO = {
  code: string;
  state: string;
};

type ResponseDTO = {
  access_token: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseDTO>
) {
  const { code, state } = req.query as RequestDTO;

  const { data } = await axios.post(
    "https://id-dev-v2.mirailabs.co/api/oauth2/token",
    {
      grant_type: "authorization_code",
      code,
      state,
      client_id: "24f0da89-b26f-492f-9818-4f0ab4fcdfe7",
      client_secret:
        "989fe6b39748cfd674ba170cfe583db63ea638e2d9597745718e44be27cbc0c7",
      scope: "profile",
      redirect_uri: "https://mirai-app-sdk-demo.vercel.app",
    }
  );
  const { access_token } = data;

  res.status(200).json({ access_token });
}
