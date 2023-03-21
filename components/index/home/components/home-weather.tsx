import getDay from "date-fns/getDay";
import { useEffect, useState } from "react";
import { useLocation } from "../../../../lib/providers/location-provider";
import { WeatherService } from "../../../../lib/repo/weather.repo";

function formatDay(dig: number) {
  switch (dig) {
    case 0:
      return "Chủ Nhật";
    case 1:
      return "Thứ 2";
    case 2:
      return "Thứ 3";
    case 3:
      return "Thứ 4";
    case 4:
      return "Thứ 5";
    case 5:
      return "Thứ 6";
    case 6:
      return "Thứ 7";
    default:
      break;
  }
}

function getIconImage(icon: string) {
  if (icon.startsWith("01") || icon.startsWith("02") || icon.startsWith("10")) {
    return `/assets/img/weather/${icon}.png`;
  } else {
    return `/assets/img/weather/${icon.slice(0, 2)}.png`;
  }
}

export function HomeWeather({ ...props }) {
  const { userLocation } = useLocation();
  const [weatherInfo, setWeatherInfo] = useState<{
    current: {
      image: string;
      location: string;
      weather: string;
      temperature: number;
    };
    details: {
      title: string;
      image: string;
      value: string;
    }[];
    dates: {
      name: string;
      image: string;
      temperature: number;
    }[];
  }>();

  useEffect(() => {
    if (userLocation) {
      WeatherService.getNearestWeather(userLocation.lng, userLocation.lat)
        .then((weather) => {
          setWeatherInfo({
            current: {
              location: weather.name,
              image: getIconImage(weather.current?.weather[0].icon),
              weather:
                weather.current?.weather[0].description[0].toUpperCase() +
                weather.current?.weather[0].description.slice(1),
              temperature: weather.current?.temp,
            },
            details: [
              {
                title: "Độ ẩm",
                image: "/assets/img/weather/trickle.png",
                value: `${weather.current?.humidity}%`,
              },
              {
                title: "Tốc độ gió",
                image: "/assets/img/weather/speed.png",
                value: `${weather.current?.wind_speed} km/h`,
              },
              {
                title: "Khả năng có mưa",
                image: "/assets/img/weather/umbrella.png",
                value: `${weather.current?.feels_like}%`,
              },
            ],
            dates: weather.daily.slice(0, 5).map((date, index) => ({
              name: index == 0 ? "Hôm nay" : formatDay(getDay(new Date(date.dt * 1000))),
              image: getIconImage(date.weather[0].icon),
              temperature: date.temp.day,
            })),
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [userLocation]);

  if (!weatherInfo) return <></>;
  return (
    <div className="flex flex-col justify-between p-0 bg-gray-100 rounded-lg lg:shadow-sm lg:bg-white xl:items-center lg:px-8 lg:py-4 xl:flex-row">
      <div className="flex flex-col md:flex-row">
        <div className="flex self-center pr-8 min-w-max">
          <img src={weatherInfo.current.image} className="object-cover w-20 shrink-0 grow-0" />
          <div className="flex flex-col pl-3">
            <span className="text-sm font-extrabold leading-none text-accent opacity-80">
              {weatherInfo.current.location}
            </span>
            <span className="mt-1 font-extrabold text-accent">{weatherInfo.current.weather}</span>
            <Temparature className="text-3xl" value={weatherInfo.current.temperature.toFixed()} />
          </div>
        </div>
        <div className="flex flex-row items-center flex-1 gap-2 px-3 py-4 bg-white border border-gray-200 lg:px-5 lg:py-3 lg:bg-gray-100 md:gap-6 justify-evenly min-w-max rounded-xl">
          {weatherInfo.details?.map((item) => (
            <div key={item.title}>
              <span className="block font-normal text-12 text-slate">{item.title}</span>
              <div className="flex flex-row items-center gap-x-1.5">
                <img srcSet={`${item.image} 2x`} className="object-cover" />
                <span className="font-extrabold text-accent text-14">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between flex-1 mt-6 border-gray-100 lg:justify-evenly xl:justify-between xl:mt-0 xl:pl-8 xl:ml-8 xl:border-l">
        {weatherInfo?.dates?.map((date) => (
          <div className="flex flex-col items-center text-center" key={date.name}>
            <div className="text-sm md:text-base lg:text-sm text-slate">{date.name}</div>
            <img src={date.image} className="object-cover w-12 md:w-20 lg:w-12" />
            <Temparature value={date.temperature.toFixed()} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Temparature({ value, className = "" }: { value: number | string } & ReactProps) {
  return (
    <span className={`font-extrabold text-accent pl-1 ${className}`}>
      {value}°<span className="inline-block translate-y-0.5 origin-top-left scale-75">C</span>
    </span>
  );
}
