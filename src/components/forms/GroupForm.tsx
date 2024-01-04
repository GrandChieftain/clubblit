"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useRef, useState } from "react";

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

import { cn } from "@/lib/utils";
import axios from 'axios'
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth, useOrganization, useOrganizationList } from "@clerk/nextjs";
import { ChevronsUpDown, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import { MoveLeft } from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import Link from "next/link";
import { Duplicate } from "@/app/api/group/route";
  

export const GroupSchema = z.object({
    acronym: z.string().max(20, {
        message: "Alright, that's not an abbreviation."
    }).or(z.literal("")),
    contactEmail: z.string().email({
        message: "Invalid"
    }).max(254, {
        message: 'Way too long. Try something else.'
    }),
    website: z.string().url({
        message: 'Invalid URL'
    }).max(253, {
        message: "You're going to have to shorten that URL."
    }).or(z.literal("")),
    club: z.object({
        name: z.string(),
        airtableId: z.string().startsWith('rec')
    })
})

export type GroupForm = z.infer<typeof GroupSchema>;

export default function GroupForm({className, clubs}: {className?: string, clubs: {name: string, airtableId: string}[]}){
    const { organization } = useOrganization();
    const orgId = organization?.id;
    const orgName = organization?.name;

    const { sessionId } = useAuth();

    const defaultValues = {
        acronym: "",
        contactEmail: "",
        website: "",
        club: undefined
    }

    const form = useForm<GroupForm>({
        resolver: zodResolver(GroupSchema),
        defaultValues: defaultValues,
    })
    const { formState: { isSubmitting } } = form

    const { mutate, isSuccess } = useMutation({
        mutationFn: async (values: GroupForm) => await axios.post('/api/group', values),
        onSuccess: () => {
            toast.success("Success. Thank you so much!");
            setTimeout(() => window.location.href = '/', 2000);
        },
        onError: () => {
            toast.error("Form submission failed. Please try again.")
        }
    })

    useEffect(() => form.reset(defaultValues), [orgId])

    const [open, setOpen] = useState(false);
    
    // MUST USE REFETCH INSIDE ONSUBMIT, DECIDE WHETHER TO DO OTHER FETCHES

    const cachedClub: GroupForm["club"] = useMemo(() => form.watch("club"), [form.watch("club")]);
    const { refetch } = useQuery({
        enabled: !!cachedClub,
        queryKey: ['duplicates', cachedClub],
        queryFn: async () => {
            const { data } = await axios.get('/api/group', {
                params: { 
                    airtableId: form.getValues("club.airtableId")
                }
            });
            return data as Duplicate[]
        }
    });

    const cancelRef = useRef<HTMLButtonElement|null>(null);
    const continueRef = useRef<HTMLButtonElement|null>(null);

    const onSubmit = async (values: GroupForm) => {
        const { data: duplicates, isSuccess } = await refetch();
        if (isSuccess && duplicates.length > 0){
            setOpen(true);
            // SHOW ALERT, CONTINUE WILL HANDLE MUTATION
            await new Promise((resolve, reject) => {
                const onContinue = () => {
                    resolve("Continue");
                    cleanUp();
                }
                const onCancel = () => {
                    reject("Cancel");
                    cleanUp();
                }
                const cleanUp = () => {
                    continueRef.current?.removeEventListener("click", onContinue);
                    cancelRef.current?.removeEventListener("click", onCancel);
                    setOpen(false);
                }
                continueRef.current?.addEventListener("click", onContinue)
                cancelRef.current?.addEventListener("click", onCancel);
            }).then(() => mutate(values))
        }
        else{
            mutate(values)
        }
    }

    const { setActive } = useOrganizationList();

    const { mutate: deleteFn, isPending: isDeleting } = useMutation({
        mutationFn: async () => await axios.delete('/api/group'),
        onSuccess: () => {
            toast.success("Organization successfully deleted.");
            setTimeout(() => setActive!({
                session: sessionId,
                organization: null
            }), 2000)
        },
        onError: () => {
            toast.error("Organization deletion failed. Please try again.")
        }
    })

    const [ mounted, setMounted ] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted){
        return null
    }

    return (
        <Card className={className + " bg-white dark:bg-[#19191A]"}>
            <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>We need to know a little more to confirm your status as an official student organization at Harvard.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-5">
                        <FormField
                            control={form.control}
                            name="club"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Organization {form.formState.errors.club && ("- " + form.formState.errors.club?.message)}
                                        <FormDescription className="font-normal">
                                            Look for its official name as registered under SOCO. If not found, contact the <Link href="mailto:treasurer@thehua.org" className="text-[#0079D3] underline">HUA treasurers</Link>.
                                        </FormDescription>
                                    </FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "justify-between bg-[#F6F7F8] dark:bg-[#272729] hover:bg-transparent focus:bg-transparent dark:hover:bg-transparent dark:focus:bg-transparent w-full",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? clubs.find(
                                                            (club) => club.name === field.value.name
                                                        )?.name
                                                        : "Select organization"}
                                                    <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full">
                                            <Command>
                                                <CommandInput placeholder="Search organization..." />
                                                <CommandEmpty>No organization found.</CommandEmpty>
                                                <CommandGroup className="p-4 max-h-[375px] overflow-auto">
                                                {clubs.map((club) => (
                                                    <CommandItem
                                                        value={club.name}
                                                        key={club.name}
                                                        onSelect={() => {
                                                            form.setValue("club", club)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                            "mr-2 h-4 w-4",
                                                            field.value && club.airtableId === field.value.airtableId
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                            )}
                                                        />
                                                        {club.name}
                                                    </CommandItem>
                            ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control} 
                            name="contactEmail" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Contact Email {form.formState.errors.contactEmail && ("- " + form.formState.errors.contactEmail?.message)}
                                        <FormDescription className="font-normal">
                                            Please provide the best email address to reach this organization concerning funding matters.
                                        </FormDescription>
                                    </FormLabel>
                                    <FormControl>
                                        <Input className="bg-[#F6F7F8] dark:bg-[#272729] hover:bg-transparent focus:bg-transparent dark:hover:bg-transparent dark:focus:bg-transparent" placeholder="" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control} 
                            name="acronym" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Acronym {form.formState.errors.acronym && ("- " + form.formState.errors.acronym?.message)}       
                                        <FormDescription className="font-normal">
                                            Does your organization also go by an acronym/abbreviation? If not, leave blank.
                                        </FormDescription>
                                    </FormLabel>
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
                                    <FormLabel>
                                        Website {form.formState.errors.website && ("- " + form.formState.errors.website?.message)} 
                                        <FormDescription className="font-normal">
                                            This is the link to your organization's website if applicable.
                                        </FormDescription>
                                    </FormLabel>
                                    <FormControl>
                                        <Input className="bg-[#F6F7F8] dark:bg-[#272729] hover:bg-transparent focus:bg-transparent dark:hover:bg-transparent dark:focus:bg-transparent" placeholder="" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button type="button" variant="default" size="icon" title="Back to home page" className={cn({
                                    'hidden': isDeleting,
                                })}><MoveLeft /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you sure about returning to the home page?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {orgName ? `This action will delete ${orgName} from our servers. Rest assured, you can always try registering an organization at a different time.` : "This action will delete your organization from our servers. Rest assured, you can always try registering another organization at a different time."}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteFn()}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button disabled className={cn({
                            'hidden': !isDeleting,
                        })}>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Deleting
                        </Button>
                        <Button type="submit" variant="default" disabled={isSuccess ? true : false} className={cn('ml-auto', {
                            'hidden': isSubmitting,
                        })}>Submit</Button>
                        <Button disabled className={cn('ml-auto', {
                            'hidden': !isSubmitting,
                        })}>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting
                        </Button>
                        <AlertDialog open={open} onOpenChange={setOpen}>
                            <AlertDialogTrigger />
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you sure about returning to the home page?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {orgName ? `This action will delete ${orgName} from our servers. Rest assured, you can always try registering an organization at a different time.` : "This action will delete your organization from our servers. Rest assured, you can always try registering another organization at a different time."}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel ref={cancelRef}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction ref={continueRef}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}

/* onClick={() => form.trigger(["contactEmail", "club"]).then(() => {
    const emailState = form.getFieldState("contactEmail");
    const clubState = form.getFieldState("club");
    if (emailState.invalid || clubState.invalid){
        return
    }
    form.handleSubmit()
})} */