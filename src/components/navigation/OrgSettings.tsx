"use client"

import { useTheme } from "next-themes"
import { useState, useEffect, MouseEventHandler, useMemo } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"

import TooltipProvider from "@/context/TooltipProvider";

import useSettings from "@/hooks/useSettings";
import { GroupSchema } from "../forms/GroupForm";
import { z } from "zod";

const withoutClub = GroupSchema.omit({club: true});
const OrgSchema = z.object({
    ...withoutClub.shape,
    club: z.object({
        name: z.string(),
        airtableId: z.string().startsWith('rec').optional()
    })
})
type OrgForm = z.infer<typeof OrgSchema>

export default function OrgSettings(){
    const { resolvedTheme: theme } = useTheme();
    const { name, ...settings } = useSettings();
    const defaultValues = {
        club: {
            name: name, 
            airtableId: undefined
        }, 
        ...settings
    }
    const form = useForm<OrgForm>({
        resolver: zodResolver(OrgSchema),
        defaultValues: defaultValues,
    })
    const errors = Object.keys(form.formState.errors);
    const { orgRole } = useAuth();

    const { mutate, isPending: isLoading, isSuccess } = useMutation({
        mutationFn: async (values: OrgForm) => await axios.post('/api/group', values),
        onSuccess: () => {
            toast.success("Successfully saved. Thank you!");
            setTimeout(() => window.location.reload(), 2000)
        },
        onError: () => {
            toast.error("Save failed. Please try again.")
        }
    })

    const onSubmit = (values: OrgForm) => mutate(values)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => form.reset(defaultValues), [name])

    const [active, setActive] = useState(true);

    const [ mounted, setMounted ] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted){
      return null
    }

    const noOrganization = () => toast.error("You must join or create an organization first.", { 
        position: "bottom-right" 
    })

    const notAdmin = () => toast.error("You are not an admin of this organization.", {
        position: "bottom-right"
    })

    const notAuthorized = (onClick: MouseEventHandler) => <TooltipProvider displayContent={active}>
        <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke={theme == "dark" ? "#C2C2C2" : "#000000"} className="w-7 h-7 dark:hover:bg-[#19191A] hover:border hover:border-transparent hover:bg-black/[0.04] rounded-md">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p>Settings</p>
    </TooltipProvider>

    const orgSettings = <Dialog onOpenChange={() => setActive(false)}>
        <TooltipProvider isButton displayContent={active}>
            <DialogTrigger asChild onMouseEnter={() => setActive(true)} onClick={() => setActive(false)}>
                <Button className="flex items-center justify-center w-7 h-7 ring-offset-transparent focus-visible:ring-transparent focus-visible:ring-0 focus-visible:ring-offset-0" variant="ghost" size="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke={theme == "dark" ? "#C2C2C2" : "#000000"} className="w-7 h-7 dark:hover:bg-[#19191A] hover:border hover:border-transparent hover:bg-black/[0.04] rounded-md">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </Button>
            </DialogTrigger>
            <p>Settings</p>
        </TooltipProvider>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            <DialogTitle>Organization Settings</DialogTitle>
            <DialogDescription asChild>
                {errors.length == 0 ? <p>Make changes to your organization here. Click save when you're done.</p> : <p className="text-destructive">Hover over the red fields to read error messages.</p>}
            </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form className="grid gap-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField 
                        control={form.control} 
                        name="club.name" 
                        render={({ field }) => (
                            <FormItem className="grid items-center grid-cols-4 gap-4">
                                {form.formState.errors.club?.name ? 
                                <TooltipProvider>
                                    <FormLabel className="text-right">Name</FormLabel>
                                    <FormMessage />
                                </TooltipProvider> : <FormLabel className="text-right">Name</FormLabel>}
                                <FormControl>
                                    <Input className="col-span-3 bg-[#F6F7F8] dark:bg-[#19191A]" placeholder="" {...field} readOnly />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control} 
                        name="acronym" 
                        render={({ field }) => (
                            <FormItem className="grid items-center grid-cols-4 gap-4">
                                {form.formState.errors.acronym ? 
                                <TooltipProvider>
                                    <FormLabel className="text-right">Abbrev.</FormLabel>
                                    <FormMessage />
                                </TooltipProvider> : <FormLabel className="text-right">Abbrev.</FormLabel>}
                                <FormControl>
                                    <Input className="col-span-3 bg-[#F6F7F8] dark:bg-[#19191A]" placeholder="" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control} 
                        name="contactEmail" 
                        render={({ field }) => (
                            <FormItem className="grid items-center grid-cols-4 gap-4">
                                {form.formState.errors.contactEmail ? 
                                <TooltipProvider>
                                    <FormLabel className="text-right">Email</FormLabel>
                                    <FormMessage />
                                </TooltipProvider> : <FormLabel className="text-right">Email</FormLabel>}
                                <FormControl>
                                    <Input className="col-span-3 bg-[#F6F7F8] dark:bg-[#19191A]" placeholder="" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control} 
                        name="website" 
                        render={({ field }) => (
                            <FormItem className="grid items-center grid-cols-4 gap-4">
                                {form.formState.errors.website ? 
                                <TooltipProvider>
                                    <FormLabel className="text-right">Website</FormLabel>
                                    <FormMessage />
                                </TooltipProvider> : <FormLabel className="text-right">Website</FormLabel>}
                                <FormControl>
                                    <Input className="col-span-3 bg-[#F6F7F8] dark:bg-[#19191A]" placeholder="" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="submit" disabled={!(form.formState.isDirty) || isSuccess ? true : false} className={cn('ml-auto',{
                            'hidden': isLoading
                        })}>Save changes</Button>
                        <Button disabled className={cn('ml-auto', {
                            'hidden': !isLoading,
                        })}>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>

    return (     
        !name ? notAuthorized(noOrganization) : orgRole != "admin" ? notAuthorized(notAdmin) : orgSettings
    )
}