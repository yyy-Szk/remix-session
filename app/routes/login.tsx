import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { authenticateUser } from "~/models/user.server";

export const loader = async () => {
  // ここに、ログインしていたらユーザーページにリダイレクトする処理を書きたい
}

export const action = async ({request}: ActionFunctionArgs) => {
  const body = await request.formData();
  const username = body.get("username");
  const password = body.get("password");

  if (!username || !password) {
    return json(
      { errors: { message: "Username and password are required." } },
      { status: 400 }
    );
  }

  const isAuthenticated = await authenticateUser(username, password);
  if (!isAuthenticated) {
    return json(
      { errors: { message: "Username or password is incorrect." } },
      { status: 400 }
    );
  }

  // ここにログイン処理を書きたい
  return redirect("/users")
}

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <h1>ログイン</h1>

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
