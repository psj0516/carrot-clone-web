"use server";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import { z } from "zod";

// 에러 메시지를 커스터마이즈 할 수 있다.
// 길이에 따른 메시지도 가능
const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string!",
        required_error: "Where is my username???",
      })
      .trim()
      .toLowerCase()
      .transform((username) => `🔥 ${username}`)
      .refine(
        // false return시 문제가 있다는 뜻
        // 특정 단어 제외
        (username) => !username.includes("potato"),
        "No potatoes allowed!"
      ),
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .superRefine(({ password, confirm_password }, ctx) => {
    // zod object 중 password, confirm_password를 가져와서 확인
    if (password !== confirm_password) {
      ctx.addIssue({
        code: "custom",
        message: "Two passwords should be equal",
        // 에러의 주인을 알려준다
        path: ["confirm_password"],
      });
    }
  });

export async function createAccount(prevState: any, formData: FormData) {
  // 유효성 검사
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };
  // parse는 에러를 throw함 (try-catch 필수) safeParse는 result로 에러를 보여줌
  const result = formSchema.safeParse(data);
  if (!result.success) {
    // 에러를 단순하게 보여주도록 flatten 사용
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}