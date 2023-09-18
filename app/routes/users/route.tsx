import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getUser } from "~/models/user.server";
import { getSession, commitSession, destroySession } from "~/sessions";

export const loader = async ({request}: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) {
    session.flash("message", "ログインしてください")
    return redirect("/login", { headers: { "Set-Cookie": await commitSession(session) }})
  }

  // ログインしていなかったらログインページにリダイレクトする処理を書きたい
  // また、ログインしている場合は、getUser()でユーザー情報を取得して返したい
  const user = await getUser(Number(session.get("userId")))
  if (!user) {
    session.flash("message", "ユーザーが見つかりませんでした。")
    return redirect("/register", { headers: { "Set-Cookie": await commitSession(session) }})
  }

  return json(
    { 
      data: { username: user.username },
      message: session.get("message")
    },
    {
      status: 200,
      headers: { "Set-Cookie": await commitSession(session) }
    }
  )
}

export const action = async ({request}: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  session.flash("message", "ログアウトしました。")
  return redirect("/", { headers: { "Set-Cookie": await destroySession(session) }})
}

export default function UsersRoute() {
  const loaderData = useLoaderData<typeof loader>();

  const welcomeMessage = `Hello! ${loaderData.data.username}`;
  return (
    <div>
      <h1>ユーザーページ</h1>

      <p>{loaderData.message}</p>
      <p>{welcomeMessage}</p>

      <Form method="post">
        <button type="submit">ログアウト</button>
        </Form>
    </div>
  );
}
