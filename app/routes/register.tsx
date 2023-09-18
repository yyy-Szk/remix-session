import { LoaderFunctionArgs, ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { createUser, getUserByUsername } from "~/models/user.server";
import { getSession, commitSession } from "~/sessions";

export const loader = async ({request}: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("userId")) {
    session.flash("message", "ログイン済みです")
    return redirect("/users", { headers: { "Set-Cookie": await commitSession(session) }})
  }

  return json(
    {
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

  const body = await request.formData();
  const username = body.get("username");
  const password = body.get("password");

  if (!username || !password) {
    return json(
      { errors: { message: "Username and password are required." } },
      { status: 400 }
    );
  }

  const user = await getUserByUsername(username);
  if (user) {
    return json(
      { errors: { message: "Username already exists." } },
      { status: 400 }
    );
  }

  const newUser = await createUser(username, password);
  session.set("userId", String(newUser.id));
  session.flash("message", "ログインしました。")

  return redirect("/users", { headers: { "Set-Cookie": await commitSession(session) }})
}

export default function Register() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <h1>ユーザー登録</h1>

      <Form method="post">
        <p style={{color: "red"}}>{actionData?.errors?.message}</p>
        <p>
          <label>Username:</label>
          <input type="text" id="username" name="username" />
        </p>

        <p>
          <label>Password:</label>
          <input type="password" id="password" name="password" />
        </p>

        <p>
          <button type="submit">登録</button>
        </p>
      </Form>

      <Link to="/login">Login</Link>
    </div>
  );
}
