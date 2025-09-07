
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EventForm } from "@/components/EventForm";
import { useEvents } from "@/hooks/useEvents";
import type { Event } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { getEvent, isLoading: areEventsLoading } = useEvents(user?.uid);
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (id) {
      if (!areEventsLoading) {
        const foundEvent = getEvent(id);
        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          toast({
              variant: "destructive",
              title: "Error",
              description: "Event not found.",
          });
          router.replace('/');
        }
        setIsLoading(false);
      }
    }
  }, [id, getEvent, router, toast, areEventsLoading]);

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-2xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Event
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Event</CardTitle>
          <CardDescription>Update the details of your financial event.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading || areEventsLoading || !event ? (
            <div className="space-y-8">
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-2 gap-8">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-32" />
            </div>
          ) : (
            <EventForm event={event} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
