import { storage } from "./storage";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function seedDatabase() {
  const adminAccounts = [
    { username: "admin2", password: "admin234" },
    { username: "admin3", password: "admin345" },
    { username: "admin4", password: "admin456" },
    { username: "admin5", password: "admin567" },
  ];

  for (const account of adminAccounts) {
    const existing = await storage.getUserByUsername(account.username);
    if (!existing) {
      const hashedPassword = await hashPassword(account.password);
      await storage.createUser({
        username: account.username,
        password: hashedPassword,
        role: "admin",
      });
    }
  }

  const existingRoutines = await storage.getAllRoutines();
  if (existingRoutines.length > 0) return;

  const admin = await storage.getUserByUsername("admin1");
  if (!admin) return;

  const routines = [
    {
      title: "Халуун орны далайн диваажин",
      destination: "Мальдив",
      description: "Мальдивын эцсийн халуун орны амралтыг мэдрээрэй. Усан дээрх виллад байрлаж, тунгалаг далайд шумбаж, цэвэрхэн цагаан элсэн эрэг, хөх усаар хүрээлэгдсэн дэлхийн түвшний спа-д амраарай.",
      duration: "7 хоног / 6 шөнө",
      price: 2499,
      image: "/images/beach-paradise.png",
      highlights: ["Усан вилла", "Шумбалт", "Спа амралт", "Нар жаргалтын аялал"],
      createdBy: admin.id,
    },
    {
      title: "Эртний сүм хийдийн аялал",
      destination: "Сием Реап, Камбож",
      description: "Ангкорын сүрлэг сүм хийдүүдийг судлан олон зууны түүхээр аялаарай. Алдарт Ангкор Ватаас нууцлаг Та Пром хүртэл, энэ соёлын аялал нь таныг Кхмерийн соёл иргэншлийн зүрх рүү хөтлөнө.",
      duration: "5 хоног / 4 шөнө",
      price: 1299,
      image: "/images/temple-tour.png",
      highlights: ["Ангкор Ват", "Орон нутгийн хоол", "Хөтөчтэй аялал", "Нар мандалтын туршлага"],
      createdBy: admin.id,
    },
    {
      title: "Альпийн уулын адал явдал",
      destination: "Швейцарийн Альп",
      description: "Швейцарийн сүрлэг Альпын уулсыг зэрлэг цэцгийн нуга, мөсөн гол, оргилын гайхамшигт үзэмжтэй хөтөчтэй аялалаар тэмцээрэй. Уулын байшинд амраж, жинхэнэ Швейцарь фондюгээр дайлуулаарай.",
      duration: "6 хоног / 5 шөнө",
      price: 1899,
      image: "/images/mountain-adventure.png",
      highlights: ["Мөсөн голын аялал", "Уулын байшин", "Үзэсгэлэнт галт тэрэг", "Альпийн зоог"],
      createdBy: admin.id,
    },
    {
      title: "Европын хот судлах аялал",
      destination: "Прага, Чех",
      description: "Прагагийн үлгэрийн гудамжаар алхаж, Хуучин хотын талбайгаас Прагагийн цайзыг үзээрэй. Нууц хашаа, уламжлалт Чех хоол, олон зууны урлаг, архитектурыг нээж мэдрээрэй.",
      duration: "4 хоног / 3 шөнө",
      price: 999,
      image: "/images/european-city.png",
      highlights: ["Цайзны аялал", "Голын аялал", "Шар айраг амталт", "Хуучин хотын алхалт"],
      createdBy: admin.id,
    },
  ];

  for (const routine of routines) {
    await storage.createRoutine(routine);
  }
}
