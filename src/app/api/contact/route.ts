import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const { name, phone, comment } = await request.json()

    const transporter = nodemailer.createTransport({
      service: "gmail", // ✅ используем Gmail как сервис
      auth: {
        user: "dkikowe@gmail.com",           // ✅ твой Gmail
        pass: "ewqheweyshubgrth"            // ✅ App Password без пробелов
      },
    })

    const mailOptions = {
      from: '"Сайт" <dkikowe@gmail.com>',
      to: "kzn.land@yandex.ru",
      subject: "Новая заявка с сайта",
      text: `Имя: ${name}\nТелефон: ${phone}\nКомментарий: ${comment}`,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка отправки:", error)
    return NextResponse.json({ error: "Ошибка при отправке письма" }, { status: 500 })
  }
}
