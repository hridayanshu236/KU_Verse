import React from "react";
import NavbarLanding from "../Components/NavbarLanding";
import FeaturesPanel from "../Components/FeaturesPanel";
import DynamicTextComponent from "../Components/DynamicTextComponent";
import Tilt from "react-parallax-tilt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faFacebook,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import kadelImage from "../Assets/kadel.png";
import sachinImage from "../Assets/sachin.png";
import parthImage from "../Assets/parth.png";
import BhishmaImage from "../Assets/bhisma.png";
import Harimage from "../Assets/profile.png";
import Footerlanding from "../Components/Footerlanding";
const LandingPage = () => {
  const teamMembers = [
    {
      name: "Ashraya Kadel",
      role: "Fullstack Developer",
      image: kadelImage,
      instagram: "https://www.instagram.com/kadel._.28/?",
      linkedin: "https://www.instagram.com/kadel._.28/?",
      facebook: "https://www.facebook.com/ashraya.kadel",
    },
    {
      name: "Parth Pandit",
      role: "Frontend Developer",
      image: parthImage,
      instagram:
        "https://www.instagram.com/parthpandit45/profilecard/?igsh=MWRsMzNrcGZvaG1mdA%3D%3D&fbclid=IwZXh0bgNhZW0CMTAAAR297QPfSc5zDEA0_nDsOaF3mSLtCfDkaWiMcqlzdUaS6nA4LrTXBfpDrjU_aem_OQRNoOcI57gkDsA1mXHC3g",
      linkedin:
        "https://www.linkedin.com/in/parth-pandit-67522a344/?fbclid=IwZXh0bgNhZW0CMTAAAR297QPfSc5zDEA0_nDsOaF3mSLtCfDkaWiMcqlzdUaS6nA4LrTXBfpDrjU_aem_OQRNoOcI57gkDsA1mXHC3g&originalSubdomain=np",
      facebook:
        "https://www.facebook.com/share/6j7JookzNBZZBk5S/?mibextid=wwXIfr",
    },
    {
      name: "Sachin Shrestha",
      role: "Backend Developer",
      image: sachinImage,
      instagram:
        "https://www.instagram.com/sachin_srestha/profilecard/?igsh=MWU2eGduN2N1ejY3bQ%3D%3D&fbclid=IwZXh0bgNhZW0CMTAAAR0xgFY8UudU0MzlqreCxyjmcws9qr9EDjq2Sx9bo1yn5vAFn_r4f5XBf_o_aem_54vIWYMWiOwYM8MihiMs8Q",
      linkedin: "www.linkedin.com/in/sachinstha",
      facebook: "https://www.facebook.com/sachin.srestha.5",
    },
    {
      name: "Bhishma Bhandari",
      role: "Frontend Developer",
      image: BhishmaImage,
      instagram: "https://www.instagram.com/rhy_tham/",
      linkedin: "https://www.instagram.com/rhy_tham/",
      facebook: "https://www.facebook.com/profile.php?id=100007165542762",
    },
    {
      name: "Hridayanshu Acharya",
      role: "Frontend Developer",
      image: Harimage,
      instagram: "https://www.instagram.com/hridayanshu_acharya",
      linkedin:
        "https://www.linkedin.com/in/hridayanshu23/?fbclid=IwZXh0bgNhZW0CMTAAAR0-r_kEq5_R8StzOGp4DCQAsGPCMf9N7IH55MveUWzFI62BHFPdCLqJ-tw_aem_FP4lJilOEVGckh4Uu8YFIQ",
      facebook: "https://www.facebook.com/Hridayanshu23/",
    },
  ];

  return (
    <>
      <NavbarLanding />
      <DynamicTextComponent />
      <FeaturesPanel />
      {/* Meet our Team section */}
      <section className="bg-gradient-to-b from-purple-700 to-purple-600 w-full flex flex-col max-md:px-6 max-sm:px-6 px-20 py-20 text-white">
        <h2 className="font-bold font-playfair text-white text-5xl leading-normal text-center mb-8">
          Meet our team
        </h2>
        <div className="w-24 h-1 bg-purple-400 mx-auto mb-12"></div>

        <div className="w-full flex flex-wrap gap-6 justify-center">
          {teamMembers.map((member, index) => (
            <Tilt
              key={index}
              className="overflow-hidden rounded-lg"
              perspective={1300}
              glareEnable={true}
              glareMaxOpacity={0.45}
              scale={1.05}
            >
              <div className="h-[350px] w-[300px] bg-white/10 backdrop-blur-sm rounded-lg flex justify-center items-center flex-col hover:bg-white/20 transition-all duration-300">
                <div className="imgContainer w-[130px] h-[130px] rounded-full border-2 border-purple-400">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="object-cover w-full h-full rounded-full"
                  />
                </div>
                <h3 className="font-bold text-[22px] mt-4">{member.name}</h3>
                <p className="font-light text-[16px] text-purple-300 mt-[-6px] mb-[6px]">
                  {member.role}
                </p>
                <div className="social-icons flex gap-2">
                  <a
                    href={member.instagram}
                    className="hover:text-purple-400 transition-colors"
                  >
                    <FontAwesomeIcon
                      icon={faInstagram}
                      className="text-white h-[24px] w-[24px]"
                    />
                  </a>
                  <a
                    href={member.linkedin}
                    className="hover:text-purple-400 transition-colors"
                  >
                    <FontAwesomeIcon
                      icon={faLinkedin}
                      className="text-white h-[24px] w-[24px]"
                    />
                  </a>
                  <a
                    href={member.facebook}
                    className="hover:text-purple-400 transition-colors"
                  >
                    <FontAwesomeIcon
                      icon={faFacebook}
                      className="text-white h-[24px] w-[24px]"
                    />
                  </a>
                </div>
              </div>
            </Tilt>
          ))}
        </div>
      </section>
      <Footerlanding />
    </>
  );
};

export default LandingPage;
