"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"), // 한국 전화번호만 받기
    "Wrong phone format"
  );

// string값을 받아 number로 convert하기 위해 coerce 사용
const tokenSchema = z.coerce.number().min(100000).max(999999);

interface ActionState {
  token: boolean;
}

// prevState로 interactive form 만들기
export async function smsLogIn(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");
  if (!prevState.token) { // action을 처음 호출했을 때
    const result = phoneSchema.safeParse(phone);

    // phone validation 성공/실패에 따라 분기처리
    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      return {
        token: true,
      };
    }
  } else {
    const result = tokenSchema.safeParse(token);
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };
    } else { // 메인 화면으로 보내기
      redirect("/");
    }
  }
}