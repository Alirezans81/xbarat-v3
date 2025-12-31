import ProfileCard from '@/components/profile/profile-card';
import ReferralCard from '@/components/profile/referral-card';
import TicketCard from '@/components/profile/ticket-card';
import CardsCard from '@/components/profile/cards-card';
import PromoBanner from '@/components/profile/promo-banner';
import TicketHistory from '@/components/profile/ticket-history';
import { getTickets } from '@/api/ticket/action';

export default async function Profile() {
    const tickets = await getTickets();
    return (
        <div className='w-full h-full flex justify-center items-center'>
            {/* mobile: vertical stack */}
            <div className="flex flex-col gap-4 sm:hidden">
                <ProfileCard />
                <ReferralCard />
                <TicketCard previousTickets={tickets} />
                <CardsCard />
                <PromoBanner />
                <TicketHistory />
            </div>

            {/* tablet: md layout */}
            <div className="hidden sm:grid md:grid lg:hidden grid-cols-2 gap-4">
                <ProfileCard className="col-span-2" />
                <ReferralCard />
                <TicketCard previousTickets={tickets} />
                <CardsCard className="col-span-2" />
                <PromoBanner className="col-span-2" />
                <TicketHistory className="col-span-2" />
            </div>

            {/* desktop: lga and bigger layout */}
            <div className="hidden lg:grid grid-cols-12 gap-3 grid-rows-12 p-3">
                <ProfileCard className="col-span-4 row-span-7" />
                <ReferralCard className="col-span-4 row-span-7" />
                <TicketCard className="col-span-4 row-span-12" previousTickets={tickets} />
                <CardsCard className="col-span-4 row-span-5" />
                <PromoBanner className="col-span-4 row-span-5" />
            </div>
        </div>
    )
}