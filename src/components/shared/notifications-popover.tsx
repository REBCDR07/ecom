
"use client";
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, ShoppingBag, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNotifications, Notification } from "@/hooks/use-notifications";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/hooks/use-auth-provider";
import { usePathname } from 'next/navigation';

interface NotificationsPopoverProps {
  userType: 'admin' | 'seller';
}

function getIconForType(type: Notification['type']) {
    switch(type) {
        case 'new_order': return <ShoppingBag className="h-4 w-4 text-blue-500" />;
        case 'new_seller_application': return <UserPlus className="h-4 w-4 text-green-500" />;
        default: return <Bell className="h-4 w-4" />;
    }
}

export default function NotificationsPopover({ userType }: NotificationsPopoverProps) {
    const { user } = useAuthContext();
    const pathname = usePathname();
    const { getUnreadNotificationsForUser, markNotificationsAsRead } = useNotifications();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (user) {
            const userIdentifier = userType === 'admin' ? 'admin' : user.id;
            const unread = getUnreadNotificationsForUser(userIdentifier);
            setNotifications(unread);
        }
    }, [user, userType, getUnreadNotificationsForUser, pathname]); // Rerun on page navigation

    const handleOpenChange = (open: boolean) => {
        if (!open && notifications.length > 0 && user) {
            const userIdentifier = userType === 'admin' ? 'admin' : user.id;
            markNotificationsAsRead(userIdentifier);
            setNotifications([]); // Visually clear them immediately
        }
    };
    
    return (
        <Popover onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                        <Badge className="absolute top-1 right-1 h-4 w-4 justify-center p-0 text-xs" variant="destructive">
                            {notifications.length}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                            {notifications.length > 0 ? `Vous avez ${notifications.length} nouvelle(s) notification(s).` : "Aucune nouvelle notification."}
                        </p>
                    </div>
                    <div className="grid gap-2">
                        {notifications.map((notification) => (
                             <Link
                                href={notification.link}
                                key={notification.id}
                                className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0 hover:bg-muted/50 p-2 rounded-lg"
                            >
                                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                <div className="grid gap-1">
                                    <div className="flex items-center gap-2">
                                        {getIconForType(notification.type)}
                                        <p className="text-sm font-medium leading-none">
                                            {notification.message}
                                        </p>
                                    </div>
                                    <p className="text-xs text-muted-foreground ml-6">
                                        {new Date(notification.timestamp).toLocaleString('fr-FR')}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
