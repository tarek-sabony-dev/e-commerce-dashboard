'use client'

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useEdgeStore } from "@/lib/edgestore/edgestore";
import * as React from 'react';
import {
  UploaderProvider,
  type UploadFn,
} from '@/components/upload/uploader-provider';
import { ImageUploader } from "@/components/upload/multi-image";

const formSchema = z.object({
  url: z.array(z.string()).min(1, { message: 'At least one image is required' }),
})

interface ImageObject {
  key: string;
  url: string;
}

export default function Home() {
  const { edgestore } = useEdgeStore()
  const [urls, setUrls] = React.useState<ImageObject[]>([])
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: urls.map((img) => img.url) || [],
    },
  })

  // Sync react-hook-form when urls change (runs after render)
  React.useEffect(() => {
    form.setValue('url', urls.map((img) => img.url) || [],)
    console.log(urls)
  }, [urls, form])
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // This will be type-safe and validated.
    const newUrl = {
      ...values,
    }

    // confirm upload for each image
    for (const url of values.url) {
      await edgestore.publicImages.confirmUpload({
        url: url
      });
    }

    // Reset form and state after successful upload
    form.reset();
    setUrls([]);
  }

  // Upload images to edgestore as temporary files
  const uploadFn: UploadFn = React.useCallback(
    async ({ file, onProgressChange, signal }) => {
      const res = await edgestore.publicImages.upload({
        options: {
          temporary: true,
        },
        file,
        signal,
        onProgressChange,
      });
      
      // you can run some server action or api here to add the necessary data to your database

      return res;
    },
    [edgestore],
  );
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <div>
                  {/* hidden binding for react-hook-form; actual value is synced via setValue when images are added/removed */}
                  <Input type="hidden" value={Array.isArray(field.value) ? field.value.join(',') : ''} readOnly  />
                  <UploaderProvider
                    uploadFn={uploadFn}
                    autoUpload
                    // reset when form is submitted
                    key={form.formState.isSubmitSuccessful ? 'reset' : 'no-reset'} 
                    onFileRemoved={(key) => {
                      // remove from local state
                      setUrls(prev => {
                        const next = prev.filter(img => img.key !== key)
                        return next
                      })
                    }}
                    onUploadCompleted={(res) => {
                      // add to local state
                      if (res?.url && res?.key) {
                        setUrls(prev => {
                          const next = [...prev, { url: res.url, key: res.key }]
                          return next
                        })
                      }
                    }}
                  >
                    <ImageUploader
                      maxFiles={10}
                      maxSize={1024 * 1024 * 1} // 1 MB
                    />
                  </UploaderProvider>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}