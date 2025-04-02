// new
'use server';
// import { signIn } from "@/auth";
// import { AuthError } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import sql from "@/db/db";
import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { generateRecurringEvents } from "@/lib/utils";
import { CalendarEvent } from "./definitions";
import { NeonQueryPromise } from "@neondatabase/serverless";
// ------------------------------
// 共通の画像アップロード処理
// ------------------------------
async function uploadImage(formData: FormData, fieldName: string): Promise< {public_url: string} > {
  const file = formData.get(fieldName) as File | null;
  if (file && file.size > 0) {
    const filename = "image_" + uuidv4();
    const filenameEncoded = encodeURIComponent(filename);
    const postRes = await fetch(`${process.env.NEXTAUTH_URL}/api/upload_file?file=${filenameEncoded}`);
    const { url, fields } = await postRes.json();
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
    const getRes = await fetch(`${process.env.NEXTAUTH_URL}/api/fetch_file?file=${filenameEncoded}`);
    const { public_url } = await getRes.json();
    return {public_url: public_url};



  }
  return {public_url:""};
}
// ------------------------------
// 認証
// ------------------------------
// export async function authenticate(prevState: string | undefined, formData: FormData) {
//   try {

//     const data = Object.fromEntries(formData.entries()) as {
//       email: string;
//       password: string;
//       redirectTo?: string;
//     };
//     // サインイン処理
//     const result = await signIn('credentials', {
//       email: data.email,
//       password: data.password,
//       redirect: true, // ← リダイレクトさせたい場合は true
//       callbackUrl: data.redirectTo || '/dashboard' // fallbackのURL
//     });

//     console.log('authenticate');
//     console.log(formData);
//     return;
//     // await signIn('credentials', formData);
//   } catch (error: unknown) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case 'CredentialsSignin':
//           return 'Invalid credentials.';
//         default:
//           return 'Something went wrong.';
//       }
//     }
//     throw error;
//   }
// }
// ------------------------------
// Zod スキーマ定義
// ------------------------------
const EventFormSchema = z.object({
  title: z.string().nonempty(),
  description: z.string(),
  startAt: z.string().nonempty(),
  endAt: z.string().nonempty(),
  store_id: z.string().nonempty(),
  isrrule: z.boolean(),
  rruleid: z.string().optional()
});

const EventArraySchema = z.array(EventFormSchema);

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
  let urlResults = {public_url: ""};
  let profile_image_url = "";
  try {
    urlResults = await uploadImage(formData, "icon");
    profile_image_url = urlResults.public_url;
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
  let urlResults = {public_url: ""};
  let profile_image_url = "";
  const icon = formData.get("icon") as File;
  if (icon && icon.size > 0) {
    try {
      urlResults = await uploadImage(formData, "icon");
      profile_image_url = urlResults.public_url;
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
  let urlResults = {public_url: ""};
  let imageUrl = "";
  try {
    urlResults = await uploadImage(formData, "icon");
    imageUrl = urlResults.public_url;
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
    image_url: imageUrl,
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
  let urlResults = {public_url: ""};
  let imageUrl = "";
  const icon = formData.get("icon") as File;
  if (icon && icon.size > 0) {
    try {
      urlResults = await uploadImage(formData, "icon");
      imageUrl = urlResults.public_url;
      console.log("imageUrl", imageUrl);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error(err);
        }
        return 'Failed to upload image';
    }
  } else {
    const query = await sql(`SELECT image_url FROM stores WHERE id = $1`, [storeId]);
    imageUrl = query[0].image_url;
  }

  const parsedFormData = StoreFormSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    business_start: formData.get("business_start"),
    business_end: formData.get("business_end"),
    address: formData.get("address"),
    image_url: imageUrl,
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
export async function createEvent(store_id: string, prevState: string | undefined, formData: FormData) {

  if (formData.get("isrrule")) {
    const dtstartRaw = formData.get("dtstart") as string;
    const untilRaw = formData.get("until") as string;
    const interval = Number(formData.get("interval"));
    const byweekday = formData.getAll("byweekday").map((day) => day.toString());
    let events: CalendarEvent[] = generateRecurringEvents(dtstartRaw, untilRaw, interval, byweekday);
    events = events.map((event) => (
      {
        id: event.id,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        startAt: event.startAt,
        endAt: event.endAt,
        store_id: store_id,
        isrrule: event.isrrule,
        rruleid: event.rruleid
      }
  ));

    console.log("==events==", events);

    const parsedEvents =  EventArraySchema.parse(events);

    try {
      await sql.transaction((tx) => {
        const promises: NeonQueryPromise<false, false>[] = parsedEvents.map((parsedEevent) =>{
          return tx(
            `INSERT INTO events (title, description, startat, endat, store_id, isrrule, rruleid) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              parsedEevent.title,
              parsedEevent.description,
              new Date(parsedEevent.startAt),
              new Date(parsedEevent.endAt),
              store_id,
              true,
              parsedEevent.rruleid
            ]
          )
        })
        return promises;
      });
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

  } else { 
    const parsedFormData = EventFormSchema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
      startAt: formData.get("start"),
      endAt: (formData.get("start") as string).replace(/T.*/, "T23:59:59"),
      store_id: store_id,
      isrrule: formData.get("isrrule") === "on" ? true : false
    });
    console.log("==formData==", formData);
    try {
      await sql(
        `INSERT INTO events (title, description, startat, endat, store_id, isrrule) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          parsedFormData.title,
          parsedFormData.description,
          new Date(parsedFormData.startAt),
          new Date(parsedFormData.endAt),
          parsedFormData.store_id,
          parsedFormData.isrrule
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
  }
  
  revalidatePath('/owner/event/create');
  redirect('/owner');
    
}
// export async function updateEvent(eventId: string | undefined, rruleid: string | undefined, prevState: string | undefined, formData: FormData) {
  // let startDate = formData.get("start");
  // const endDate = (formData.get("start") as string).replace(/T.*/, "T23:59:59");

  // if (formData.get("isrrule") && rruleid) {
  //   const dtstartRaw = formData.get("dtstart") as string;
  //   const untilRaw = formData.get("until") as string;
  //   const interval = Number(formData.get("interval"));
  //   const byweekday = formData.getAll("byweekday").map((day) => day.toString());
  //   const events: CalendarEvent[] = generateRecurringEvents(dtstartRaw, untilRaw, interval, byweekday);

  //   const parsedEvents =  EventArraySchema.parse(events);
  
  //   try {
  //     await sql("DELETE FROM events WHERE rruleid = $1", [rruleid]);
      
  //     await sql.transaction((tx) => {
  //       const promises: Array<any> = [];
  //       for (const parsedEvent of parsedEvents) {
  //         promises.push(tx(
  //           `INSERT INTO events (title, description, startat, endat, store_id, isrrule, rruleid) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
  //           [
  //             parsedEvent.title,
  //             parsedEvent.description,
  //             new Date(parsedEvent.start),
  //             new Date(parsedEvent.end),
  //             parsedEvent.store_id,
  //             true,
  //             parsedEvent.rruleid
  //           ]
  //         ));
  //       }
  //       return promises;
  //     });

  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       return JSON.stringify({
  //         success: false,
  //         error: { message: error.message, stack: error.stack }
  //       });
  //     }
  //     return JSON.stringify({
  //       success: false,
  //       error: { message: "Unknown error", stack: "" }
  //     });
  //   }

   
  // } else if (!formData.get("isrrule") && eventId) {
  //   const parsedFormData = EventFormSchema.parse({
  //     title: formData.get("title"),
  //     description: formData.get("description"),
  //     start: startDate || undefined,
  //     end: endDate || undefined,
  //     store_id: "", // 更新時は store_id は変更しない
  //     isrrule: formData.get("isrrule") === "on" ? true : false
  //   });
  //   console.log("==formData==", formData);
  //   try {
  //     await sql(
  //       `UPDATE events SET title = $1, description = $2, startat = $3, endat = $4, isrrule = $6 WHERE id = $7`,
  //       [
  //         parsedFormData.title,
  //         parsedFormData.description,
  //         new Date(parsedFormData.start),
  //         new Date(parsedFormData.end),
  //         parsedFormData.isrrule,
  //         eventId,
  //       ]
  //     );
  //     console.log("Event update success!");
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       return JSON.stringify({
  //         success: false,
  //         error: { message: error.message, stack: error.stack }
  //       });
  //     }
  //     return JSON.stringify({
  //       success: false,
  //       error: { message: "Unknown error", stack: "" }
  //     });
  //   }
  // }

  // revalidatePath('/owner/event/edit');
  // redirect('/owner');

// }

export async function updateEvent(eventId: string, prevState: string | undefined, formData: FormData) {

  const parsedFormData = EventFormSchema.parse({
    title: formData.get('title'),
    description: formData.get('description'),
    startAt: formData.get("start"),
    endAt: (formData.get("start") as string).replace(/T.*/, "T23:59:59"),
    store_id: formData.get("store"), // 更新時は store_id は変更しない
    isrrule: formData.get("isrrule") === "true" ? true : false
  });
  console.log("==formData==", formData);
  try {
    await sql(
      `UPDATE events SET title = $1, description = $2, startat = $3, endat = $4, isrrule = $5 WHERE id = $6`,
      [
        parsedFormData.title,
        parsedFormData.description,
        new Date(parsedFormData.startAt),
        new Date(parsedFormData.endAt),
        parsedFormData.isrrule,
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
