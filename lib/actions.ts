// new
'use server';
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import sql from "@/db/db";
import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
// ------------------------------
// 共通の画像アップロード処理
// ------------------------------
async function uploadImage(formData: FormData, fieldName: string): Promise<string> {
  const file = formData.get(fieldName) as File | null;
  if (file && file.size > 0) {
    const filename = "image_" + uuidv4();
    const filenameEncoded = encodeURIComponent(filename);
    const res = await fetch(`http://localhost:3000/api/upload_file?file=${filenameEncoded}`);
    const { url, fields } = await res.json();
    const uploadFormData = new FormData();
    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      uploadFormData.append(key, value as string | Blob);
    });
    const uploadRes = await fetch(url, {
      method: 'POST',
      body: uploadFormData,
    });
    if (!uploadRes.ok) {
      throw new Error("Failed to upload image");
    }
    console.log("Uploaded image");
    return url;
  }
  return "";
}
// ------------------------------
// 認証
// ------------------------------
export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', formData);
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
// ------------------------------
// Zod スキーマ定義
// ------------------------------
const EventFormSchema = z.object({
  title: z.string().nonempty(),
  description: z.string(),
  start: z.string().nonempty(),
  end: z.string().nonempty(),
  store_id: z.string(),
});
const StoreFormSchema = z.object({
  name: z.string().nonempty(),
  description: z.string(),
  business_start: z.string().nonempty(),
  business_end: z.string().nonempty(),
  address: z.string().nonempty(),
  image_url: z.string()
});
const NotificationFormSchema = z.object({
  description: z.string().nonempty(),
  summary: z.string().nonempty(),
  profile_image_url: z.string(),
  notify: z.preprocess(
    (val) => val === "on", // チェックされていれば true に変換
    z.boolean()
  ),
  store_id: z.string()
});
// ------------------------------
// Notification 作成・更新
// ------------------------------
export async function createNotification(storeId: string, prevState: string | undefined, formData: FormData) {
  const notificationCount = await sql(`SELECT COUNT(*) FROM notifications WHERE store_id = $1`, [storeId]);
  let profile_image_url = "";
  try {
    profile_image_url = await uploadImage(formData, "icon");
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err);
    }
    return 'Failed to upload image';
  }
  const parsedFormData = NotificationFormSchema.parse({
    description: formData.get("description"),
    summary: formData.get("summary"),
    profile_image_url,
    notify: formData.get("notify"),
    store_id: storeId,
  });
  try {
    await sql(
      `INSERT INTO notifications (index, description, summary, profile_image_url, notify, store_id) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        Number(notificationCount[0].count) + 1,
        parsedFormData.description,
        parsedFormData.summary,
        parsedFormData.profile_image_url,
        parsedFormData.notify,
        parsedFormData.store_id,
      ]
    );
    console.log("Notification create success!");
  } catch (error: unknown) {
    if (error instanceof Error) {
      return JSON.stringify({
        success: false,
        error: { message: error.message, stack: error.stack }
      });
    }
    return JSON.stringify({
      success: false,
      error: { message: "Unknown error", stack: "" }
    });
  }
  revalidatePath('/owner/mypage/create');
  redirect('/owner/mypage/create');
}
export async function updateNotification(notificationId: string, prevState: string | undefined, formData: FormData) {
  let profile_image_url = "";
  const icon = formData.get("icon") as File;
  if (icon && icon.size > 0) {
    try {
      profile_image_url = await uploadImage(formData, "icon");
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error(err);
        }
      return 'Failed to upload image';
    }
  } else {
    const query = await sql(`SELECT profile_image_url FROM notifications WHERE id = $1`, [notificationId]);
    profile_image_url = query[0].profile_image_url;
  }
  const parsedFormData = NotificationFormSchema.parse({
    description: formData.get("description"),
    summary: formData.get("summary"),
    profile_image_url,
    notify: formData.get("notify"),
    store_id: "", // 更新時は store_id は不要
  });
  try {
    await sql(
      `UPDATE notifications SET description = $1, summary = $2, profile_image_url = $3, notify = $4 WHERE id = $5`,
      [
        parsedFormData.description,
        parsedFormData.summary,
        parsedFormData.profile_image_url,
        parsedFormData.notify,
        notificationId,
      ]
    );
    console.log("Notification update success!");
  } catch (error: unknown) {
    if (error instanceof Error) {
      return JSON.stringify({
        success: false,
        error: { message: error.message, stack: error.stack }
      });
    }
    return JSON.stringify({
      success: false,
      error: { message: "Unknown error", stack: "" }
    });
  }
  revalidatePath('/owner/mypage/edit');
  redirect('/owner/mypage/edit');
}
// ------------------------------
// Store 作成・更新
// ------------------------------
export async function createStore(prevState: string | undefined, formData: FormData) {
  const newStoreId = uuidv4();
  let image_url = "";
  try {
    image_url = await uploadImage(formData, "icon");
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err);
    }
    return 'Failed to upload image';
  }
  const parsedFormData = StoreFormSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    business_start: formData.get("business_start"),
    business_end: formData.get("business_end"),
    address: formData.get("address"),
    image_url,
  });
  try {
    await sql(
      `INSERT INTO stores (id, name, description, business_start, business_end, address, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        newStoreId,
        parsedFormData.name,
        parsedFormData.description,
        parsedFormData.business_start,
        parsedFormData.business_end,
        parsedFormData.address,
        parsedFormData.image_url
      ]
    );
    console.log("Store creation success!");
  } catch (error: unknown) {
    if (error instanceof Error) {
      return JSON.stringify({
        success: false,
        error: { message: error.message, stack: error.stack }
      });
    }
    return JSON.stringify({
      success: false,
      error: { message: "Unknown error", stack: "" }
    });
  }
  revalidatePath('/owner');
  redirect('/owner');
}
export async function updateStore(storeId: string, prevState: string | undefined, formData: FormData) {
  let image_url = "";
  const icon = formData.get("icon") as File;
  if (icon && icon.size > 0) {
    try {
      image_url = await uploadImage(formData, "icon");
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error(err);
        }
        return 'Failed to upload image';
    }
  } else {
    const query = await sql(`SELECT image_url FROM stores WHERE id = $1`, [storeId]);
    image_url = query[0].image_url;
  }
  const parsedFormData = StoreFormSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    business_start: formData.get("business_start"),
    business_end: formData.get("business_end"),
    address: formData.get("address"),
    image_url,
  });
  try {
    await sql(
      `UPDATE stores
       SET name = $1, description = $2, business_start = $3, business_end = $4, address = $5, image_url = $6
       WHERE id = $7`,
      [
        parsedFormData.name,
        parsedFormData.description,
        parsedFormData.business_start,
        parsedFormData.business_end,
        parsedFormData.address,
        parsedFormData.image_url,
        storeId,
      ]
    );
    console.log("Store update success!");
  } catch (error: unknown) {
    if (error instanceof Error) {
      return JSON.stringify({
        success: false,
        error: { message: error.message, stack: error.stack }
      });
    }
    return JSON.stringify({
      success: false,
      error: { message: "Unknown error", stack: "" }
    });
  }
  revalidatePath('/owner/store/edit');
  redirect('/owner/store/edit');
}
// ------------------------------
// Event 作成・更新
// ------------------------------
export async function createEvent(prevState: string | undefined, formData: FormData) {
  const newStoreId = uuidv4();
  const parsedFormData = EventFormSchema.parse({
    title: formData.get("title"),
    description: formData.get("description"),
    start: formData.get("start"),
    end: formData.get("end"),
    store_id: newStoreId,
  });
  console.log("==formData==", formData);
  try {
    await sql(
      `INSERT INTO events (title, description, startat, endat, store_id) VALUES ($1, $2, $3, $4, $5)`,
      [
        parsedFormData.title,
        parsedFormData.description,
        new Date(parsedFormData.start),
        new Date(parsedFormData.end),
        parsedFormData.store_id,
      ]
    );
    console.log("Event creation success!");
  } catch (error: unknown) {
    if (error instanceof Error) {
      return JSON.stringify({
        success: false,
        error: { message: error.message, stack: error.stack }
      });
    }
    return JSON.stringify({
      success: false,
      error: { message: "Unknown error", stack: "" }
    });
  }
  revalidatePath('/owner/event/create');
  redirect('/owner');
}
export async function updateEvent(eventId: string, prevState: string | undefined, formData: FormData) {
  const parsedFormData = EventFormSchema.parse({
    title: formData.get('title'),
    description: formData.get('description'),
    start: formData.get('start'),
    end: formData.get('end'),
    store_id: "", // 更新時は store_id は変更しない
  });
  console.log("==formData==", formData);
  try {
    await sql(
      `UPDATE events SET title = $1, description = $2, startat = $3, endat = $4 WHERE id = $5`,
      [
        parsedFormData.title,
        parsedFormData.description,
        new Date(parsedFormData.start),
        new Date(parsedFormData.end),
        eventId,
      ]
    );
    console.log("Event update success!");
  } catch (error: unknown) {
    if (error instanceof Error) {
      return JSON.stringify({
        success: false,
        error: { message: error.message, stack: error.stack }
      });
    }
    return JSON.stringify({
      success: false,
      error: { message: "Unknown error", stack: "" }
    });
  }
  revalidatePath('/owner/event/edit');
  redirect('/owner');
}