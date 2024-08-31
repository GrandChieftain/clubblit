"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
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
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
  

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
    //const [isSubmitting, setIsSubmitting] = useState(false);
    const { formState: { isSubmitting } } = form

    const { mutate, isSuccess, isPending: isLoading } = useMutation({
        mutationFn: async (values: GroupForm) => await axios.post('/api/group', values),
        onSuccess: () => {
            toast.success("Success. Thank you so much!");
            setTimeout(() => window.location.href = '/', 2000);
        },
        onError: () => {
            toast.error("Form submission failed. Please try again.")
        }
    })

    const { watch } = form;

    const [open, setOpen] = useState(false);

    const currentClub = watch("club");
    const cachedClub: GroupForm["club"] = useMemo(() => currentClub, [currentClub]);
    const { data: duplicates, refetch } = useQuery({
        enabled: false,
        queryKey: ['duplicates', cachedClub],
        queryFn: async () => {
            const { data: { response } } = await axios.get('/api/group', {
                params: { 
                    airtableId: form.getValues("club.airtableId")
                }
            });
            return response as Duplicate[]
        }
    });

    const duplicatesTable = <Table>
    <TableCaption>There {duplicates?.length === 1 ? "is 1 instance" : `are ${duplicates?.length} instances`} of the {form.getValues("club.name")} already registered on our server.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead className="text-center">Creator</TableHead>
        <TableHead className="text-center">Date</TableHead>
        <TableHead className="text-center">Members</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {duplicates?.map((duplicate, index) => <TableRow key={index}>
        <TableCell className="font-medium text-center">{duplicate.creator ? <a href={`mailto:${duplicate.creator.emailAddress}`} className="text-[#0070E0] underline">{duplicate.creator.name}</a> : "User not found"}</TableCell>
        <TableCell className="text-center">{(new Date(duplicate.createdAt)).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</TableCell>
        <TableCell className="text-center">{duplicate.members_count ?? "N/A"}</TableCell>
      </TableRow>)}
    </TableBody>
  </Table>

    const onSubmit = async (values: GroupForm) => {
        const { data: duplicates, isSuccess, isError } = await refetch();
        if (isSuccess && duplicates.length > 0){
            setOpen(true);
        }
        else if (isError){
            toast.error("Form submission failed. Please try again.")
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

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted){
        return null
    }

    return (
        <Card className={cn("dark:bg-[#19191A] border-[#E4E4E7] dark:border-[#515152]", className)}>
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
                                            Look for its official name as registered under SOCO. If not found, contact the <Link href="mailto:treasurer@thehua.org" className="text-[#0070E0] underline">HUA treasurers</Link>.
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
                        <Button type="submit" variant="default" disabled={isSuccess} className={cn('ml-auto', {
                            'hidden': isSubmitting || isLoading || open,
                        })}>Submit</Button>
                        <Button disabled className={cn('ml-auto', {
                            'hidden': !isSubmitting && !isLoading && !open,
                        })}>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting
                        </Button>
                        <AlertDialog open={open} onOpenChange={setOpen}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-center">
                                        Would you still like to proceed?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {duplicatesTable}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => [mutate(form.getValues()), setOpen(false)]}>Continue</AlertDialogAction>
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