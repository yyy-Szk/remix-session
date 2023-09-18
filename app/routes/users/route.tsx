import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getUser } from "~/models/user.server";

export const loader = async () => {
  // ログインしていなかったらログインページにリダイレクトする処理を書きたい
  // また、ログインしている場合は、getUser()でユーザー情報を取得して返したい
  const user = { username: "test-user", password: "sample" }
  return { 
    data: { username: user.username }
  }
}

export const action = async () => {
  // ここにログアウト処理を書く
  return redirect("/")
}

export default function UsersRoute() {
  const loaderData = useLoaderData<typeof loader>();

  const welcomeMessage = `Hello! ${loaderData.data.username}`;
  return (
    <div>
      <h1>ユーザーページ</h1>

      <p>{welcomeMessage}</p>

      <Form method="post">
        <button type="submit">ログアウト</button>
        </Form>
    </div>
  );
}
