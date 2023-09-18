import { LoaderFunctionArgs, ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { authenticateUser } from "~/models/user.server";
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

  const userId = await authenticateUser(username, password);
  if (!userId) {
    return json(
      { errors: { message: "Username or password is incorrect." } },
      { status: 400 }
    );
  }

  session.set("userId", String(userId));
  session.flash("message", "ログインしました。")

  return redirect("/users", { headers: { "Set-Cookie": await commitSession(session) }})
}

export default function Login() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <h1>ログイン</h1>
      <p>{loaderData.message}</p>

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
          <button type="submit">ログイン</button>
        </p>
      </Form>

      <Link to="/register">Register</Link>
    </div>
  );
}
