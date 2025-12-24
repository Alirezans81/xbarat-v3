import ProfileCard from '@/components/profile/profile-card';
import ReferralCard from '@/components/profile/referral-card';
import TicketCard from '@/components/profile/ticket-card';
import CardsCard from '@/components/profile/cards-card';
import PromoBanner from '@/components/profile/promo-banner';
import TicketHistory from '@/components/profile/ticket-history';

export default function Profile() {
    return (
        <div className='w-full h-full flex justify-center items-center'>
            {/* MOBILE: vertical stack */}
            <div className="flex flex-col gap-4 sm:hidden">
                <ProfileCard />
                <ReferralCard />
                <TicketCard />
                <CardsCard />
                <PromoBanner />
                <TicketHistory />
            </div>

            {/* TABLET: md layout */}
            <div className="hidden sm:grid md:grid lg:hidden grid-cols-2 gap-4">
                <ProfileCard className="col-span-2" />
                <ReferralCard />
                <TicketCard />
                <CardsCard className="col-span-2" />
                <PromoBanner className="col-span-2" />
                <TicketHistory className="col-span-2" />
            </div>

            {/* DESKTOP: lg+ layout */}
            <div className="hidden lg:grid grid-cols-12 gap-3 grid-rows-12 ">
                <ProfileCard className="col-span-4 row-span-7" />
                <ReferralCard className="col-span-4 row-span-7" />
                <TicketCard className="col-span-4 row-span-7" />
                <CardsCard className="col-span-4 row-span-5" />
                <PromoBanner className="col-span-4 row-span-5" />
                <TicketHistory className="col-span-4 row-span-5" />
            </div>
        </div>
    )
}