"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { cn } from "@/lib/utils";
import axios from 'axios'
import { useMutation } from "@tanstack/react-query";
import { useOrganization } from "@clerk/nextjs";
import { Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"

export const genres = ["Academic & Pre-Professional", "College Life", 
    "Creative & Performing Arts", "Cultural & Racial Initiatives", 
    "Gender & Sexuality", "Government & Politics", "Health & Wellness", 
    "Hobbies & Special Interests", "Media & Publications", 
    "Peer Counseling & Peer Education", "Public Service", 
    "Women’s Initiatives", "Religious & Spiritual"] as const

export const GroupSchema = z.object({
    id: z.string(),
    name: z.string(),
    acronym: z.string().max(20, {
        message: "Alright, that's not an acronym."
    }).or(z.literal("")),
    contactEmail: z.string().email().max(254, {
        message: 'Way too long. Try something else.'
    }),
    website: z.string().url({
        message: 'Invalid URL'
    }).max(253, {
        message: "You're going to have to shorten that URL."
    }).or(z.literal("")),
    genre: z.enum(genres)
})

export type GroupForm = z.infer<typeof GroupSchema>;

export default function GroupForm(props: {className?: string}){

    const { organization } = useOrganization();
    const orgId = organization?.id;
    const orgName = organization?.name;
    const [formStep, setFormStep] = useState(0);
    const background = useRef<HTMLDivElement>(null);

    const defaultValues = {
        id: orgId,
        name: orgName,
        acronym: "",
        contactEmail: "",
        website: "",
        genre: undefined
    }

    const form = useForm<GroupForm>({
        resolver: zodResolver(GroupSchema),
        defaultValues: defaultValues,
    })

    const { mutate, isLoading, isSuccess } = useMutation({
        mutationFn: async (values: GroupForm) => {
            const { data } = await axios.post('/api/group', values);
            return data as string
        },
        onSuccess: () => {
            toast.success("Success. Thank you so much!");
            setTimeout(() => window.location.reload(), 2000);
        },
        onError: () => {
            toast.error("Form submission failed. Please try again.")
        }
    })

    useEffect(() => form.reset(defaultValues), [orgId, orgName])

    const onSubmit = (values: GroupForm) => mutate(values)

    const [ mounted, setMounted ] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted){
        return null
    }

    return (
        <Card className={props?.className + " bg-white dark:bg-[#19191A]"}>
            <CardHeader>
                <CardTitle>{formStep == 0 ? "Additional Information" : "Continued"}</CardTitle>
                <CardDescription>{formStep  == 0 ? "We need to know a little more to confirm your status as an official student organization at Harvard." : "These fields are all optional."}</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent>
                        <div className={cn('space-y-5', {
                            'hidden': formStep == 1,
                        })}>
                            <FormField 
                                control={form.control} 
                                name="contactEmail" 
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Email {form.formState.errors.contactEmail ? ("- " + form.formState.errors.contactEmail?.message) : <FormDescription className="font-normal">Please provide the best email address to reach this organization concerning funding matters.</FormDescription>}</FormLabel>
                                        <FormControl>
                                            <Input className="bg-[#F6F7F8] dark:bg-[#272729] hover:bg-transparent focus:bg-transparent dark:hover:bg-transparent dark:focus:bg-transparent" placeholder="" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="genre" 
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Genre {form.formState.errors.genre ? ("- " + form.formState.errors.genre?.message) : <FormDescription className="font-normal">Select the one that best applies.</FormDescription>}</FormLabel>
                                        <FormControl>
                                        <RadioGroup onValueChange={field.onChange}>
                                            <div className="grid grid-cols-3 grid-rows-5 gap-x-3 items-center bg-[#F6F7F8] dark:bg-[#272729] border-input border rounded-md px-3 py-1 hover:bg-transparent ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:bg-transparent dark:hover:bg-transparent dark:focus:bg-transparent" tabIndex={0} ref={background} onClick={() => background.current?.focus()}>
                                                {genres.map((genre, index) =>
                                                <div key={index} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={genre} id={genre} />
                                                    <Label className="text-[13px] font-normal" htmlFor={genre}>{genre}</Label>
                                                </div>)}
                                            </div>
                                        </RadioGroup>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className={cn('space-y-5', {
                            'hidden': formStep == 0,
                        })}>
                            <FormField
                                control={form.control} 
                                name="acronym" 
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Acronym {form.formState.errors.acronym ? ("- " + form.formState.errors.acronym?.message) : <FormDescription className="font-normal">Does your organization go by an acronym/abbreviation? If not, leave blank.</FormDescription>}</FormLabel>
                                        <FormControl>
                                            <Input className="bg-[#F6F7F8] dark:bg-[#272729] hover:bg-transparent focus:bg-transparent dark:hover:bg-transparent dark:focus:bg-transparent" placeholder="" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control} 
                                name="website" 
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Website {form.formState.errors.website ? ("- " + form.formState.errors.website?.message) : <FormDescription className="font-normal">This is the link to your organization's website if applicable.</FormDescription>}</FormLabel>
                                        <FormControl>
                                            <Input className="bg-[#F6F7F8] dark:bg-[#272729] hover:bg-transparent focus:bg-transparent dark:hover:bg-transparent dark:focus:bg-transparent" placeholder="" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex">
                        <Button type="button" variant="ghost" onClick={() => form.trigger(["contactEmail", "genre"]).then(() => {
                            const emailState = form.getFieldState("contactEmail");
                            const genreState = form.getFieldState("genre");
                            if (emailState.invalid || genreState.invalid){
                                return
                            }
                            setFormStep(1);
                        })}
                        className={cn('ml-auto', {
                            'hidden': formStep == 1,
                        })}>Next</Button>
                        <Button type="button" variant="ghost" onClick={() => setFormStep(0)} className={cn({
                            'hidden': formStep == 0,
                        })}>Back</Button>
                        <Button type="submit" variant="default" disabled={isSuccess ? true : false} className={cn('ml-auto', {
                            'hidden': formStep == 0 || isLoading,
                        })}>Submit</Button>
                        <Button disabled className={cn('ml-auto', {
                            'hidden': formStep == 0 || !isLoading,
                        })}>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}