import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  IconButton,
  Input,
  Textarea,
  Checkbox,
} from "@material-tailwind/react";
import { FingerPrintIcon, UsersIcon } from "@heroicons/react/24/solid";
import { PageTitle, Footer } from "@/widgets/layout";
import { FeatureCard, TeamCard } from "@/widgets/cards";
import { featuresData, teamData, contactData } from "@/data";
import { Link } from "react-router-dom";


export function Home() {
  return (
    <>
      <div className="relative flex h-screen content-center items-center justify-center pt-16 pb-32">
        <div className="absolute top-0 h-full w-full bg-[url('/img/background.jpg')] bg-cover bg-center" />
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
        <div className="max-w-8xl container relative mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
              <Typography
                variant="h1"
                color="white"
                className="mb-6 font-black"
              >
                Welcome to QuickBytes!
              </Typography>
              <Typography variant="lead" color="white" className="opacity-80">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aspernatur tempora porro mollitia quisquam error, quam consequatur ex, ullam quos natus corrupti, possimus quia omnis numquam enim! Asperiores rerum minima maiores.
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <section className="-mt-32 bg-white px-4 pb-20 pt-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map(({ color, title, icon, description }) => (
              <FeatureCard
                key={title}
                color={color}
                title={title}
                icon={React.createElement(icon, {
                  className: "w-5 h-5 text-white",
                })}
                description={description}
              />
            ))}
          </div>
          {/* JOIN AS RESTAURANT */}
          <div className="mt-32 flex flex-wrap items-center">
            <div className="mx-auto -mt-8 w-full px-4 md:w-5/12">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-gray-900 p-2 text-center shadow-lg">
                <FingerPrintIcon className="h-8 w-8 text-white " />
              </div>
              <Typography
                variant="h3"
                className="mb-3 font-bold"
                color="blue-gray"
              >
                Join as a restaurant
              </Typography>
              <Typography className="mb-8 font-normal text-blue-gray-500">
                Join us as a restaurant. Add your menu and price list on our site. Get verified by QuickBytes and reach to more customers.
                <br />
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi deleniti quo quas veritatis, iure ut cumque tempora. Quia ex voluptas porro vel dolore sequi, dolores quidem est ea libero fugit! Esse, deleniti! Dolorum temporibus quis, aliquam laudantium laboriosam praesentium veniam.
              </Typography>
              <Link to="/restaurant-signup">
                  <Button>Join Now</Button>
              </Link>
            </div>
            <div className="mx-auto mt-24 flex w-full justify-center px-4 md:w-4/12 lg:mt-0">
              <Card className="shadow-lg border shadow-gray-500/10 rounded-lg">
                <CardHeader floated={false} className="relative h-56">
                  <img
                    alt="Card Image"
                    src="/img/teamwork.png"
                    className="h-full w-full"
                  />
                </CardHeader>
                <CardBody>
                  <Typography variant="small" color="blue-gray" className="font-normal">Featured Restaurant</Typography>
                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className="mb-3 mt-2 font-bold"
                  >
                    Punjab-Da-Dhaba
                  </Typography>
                  <Typography className="font-normal text-blue-gray-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam, quasi nostrum minus quia nihil impedit molestiae qui quo nobis voluptatem eius excepturi saepe optio architecto?
                  </Typography>
                </CardBody>
              </Card>
            </div>
          </div>
          {/* //JOIN AS DELIVERY PARTNER */}
          <div className="mt-32 flex flex-wrap items-center">
          <div className="mx-auto -mt-8 w-full px-4 md:w-5/12">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-gray-900 p-2 text-center shadow-lg">
                <FingerPrintIcon className="h-8 w-8 text-white " />
              </div>
              <Typography
                variant="h3"
                className="mb-3 font-bold"
                color="blue-gray"
              >
                Join as a delivery partner
              </Typography>
              <Typography className="mb-8 font-normal text-blue-gray-500">
                Join us as a delivery partner. Register yourself and get verified as a delivery agent and help deliver food to people in your area.
                <br />
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi deleniti quo quas veritatis, iure ut cumque tempora. Quia ex voluptas porro vel dolore sequi, dolores quidem est ea libero fugit! Esse, deleniti! Dolorum temporibus quis, aliquam laudantium laboriosam praesentium veniam.
              </Typography>
              <Button variant="filled">Know more</Button>
            </div>
            <div className="mx-auto mt-24 flex w-full justify-center px-4 md:w-4/12 lg:mt-0">
              <Card className="shadow-lg border shadow-gray-500/10 rounded-lg">
                <CardHeader floated={false} className="relative h-56">
                  <img
                    alt="Card Image"
                    src="/img/teamwork.png"
                    className="h-full w-full"
                  />
                </CardHeader>
                <CardBody>
                  <Typography variant="small" color="blue-gray" className="font-normal">Testimonial</Typography>
                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className="mb-3 mt-2 font-bold"
                  >
                    Agent Vinod
                  </Typography>
                  <Typography className="font-normal text-blue-gray-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam, quasi nostrum minus quia nihil impedit molestiae qui quo nobis voluptatem eius excepturi saepe optio architecto?
                  </Typography>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 pt-20 pb-48">
        <div className="container mx-auto">
          <PageTitle section="Areas We Serve" heading="We serve in these areas currently">
            If you didn't find your city below, don't worry. We gotcha! We will reach your hometown soon. Till then, vouch for us and - <br/> Stay Healthy. Stay Happy.
          </PageTitle>
          <div className="mt-24 grid grid-cols-1 gap-12 gap-x-24 md:grid-cols-2 xl:grid-cols-4">
            {teamData.map(({ img, name, position, socials }) => (
              <TeamCard
                key={name}
                img={img}
                name={name}
                position={position}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="relative bg-white py-24 px-4">
        <div className="container mx-auto">
          <PageTitle section="Join Us" heading="Register Now On QuickBytes">
            Join us as an entity. We are on a mission to change the food delivery business in India. Feel free to join below.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium repudiandae molestias enim molestiae quisquam nam.
          </PageTitle>
          <div className="mx-auto mt-20 mb-48 grid max-w-5xl grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3">
            {contactData.map(({ title, icon, description }) => (
              <Card
                key={title}
                color="transparent"
                shadow={false}
                className="text-center text-blue-gray-900"
              >
                <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-blue-gray-900 shadow-lg shadow-gray-500/20">
                  {React.createElement(icon, {
                    className: "w-5 h-5 text-white",
                  })}
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  {title}
                </Typography>
                <Typography className="font-normal text-blue-gray-500">
                  {description}
                </Typography>
              </Card>
            ))}
          </div>
          <PageTitle section="Help & Support" heading="Any queries? Reach us here.">
            Complete this form and we will get back to you in 24 hours.
          </PageTitle>
          <form className="mx-auto w-full mt-12 lg:w-5/12">
            <div className="mb-8 flex gap-8">
              <Input variant="outlined" size="lg" label="Full Name" />
              <Input variant="outlined" size="lg" label="Email Address" />
            </div>
            <Textarea variant="outlined" size="lg" label="Message" rows={8} />
            <Checkbox
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center font-normal"
                >
                  I agree the
                  <a
                    href="#"
                    className="font-medium transition-colors hover:text-gray-900"
                  >
                    &nbsp;Terms and Conditions
                  </a>
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />
            <Button variant="gradient" size="lg" className="mt-8" fullWidth>
              Send Message
            </Button>
          </form>
        </div>
      </section>
      <div className="bg-white">
        <Footer />
      </div>
    </>
  );
}

export default Home;
