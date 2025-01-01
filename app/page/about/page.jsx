"use client";

import { useRouter } from "next/navigation";
import styles from "@/app/styles/about.module.css";

export default function About() {
  const router = useRouter();

  const openTips = (tip) => {
    switch (tip) {
      case "free":
        router.push("football", { scroll: false });
        break;
      case "other":
        router.push("otherSport", { scroll: false });
        break;
      case "vip":
        router.push("vip", { scroll: false });
        break;
    
      default:
        break;
    }
  };

  return (
    <div className={styles.aboutContainer}>
      <div className={styles.aboutContainerInner}>
        <h1>
          433tips.com is the industry&apos;s premier source for sports
          analysis and predictions.
        </h1>
        <p>
          At 433tips.com, our main emphasis is providing you with detailed
          analysis and predictions of football, basketball, hockey, and tennis,
          among other games. Our analysis is based on data-driven insights,
          informed decision-making, risk management, and enhanced understanding
          from our expert tipsters who help empower investors and gamblers to
          navigate uncertainty and anticipate potential outcomes in the game of
          football, making you more profitable.
        </p>
      </div>
      <div className={styles.aboutContainerInner}>
        <h1>What Makes 433tips.com Stand Out?</h1>
        <p>
          Our diligent team invests considerable time and effort to create
          well-researched and accurate sports predictions. These predictions are
          formulated by thoroughly analyzing statistics and developing a
          profound understanding of matches. Rest assured, our dedicated experts
          strive to deliver reliable tips that you can confidently depend on.
          Our predictions are readily available with major betting sites,
          including Unibet, Sportybet, William Hill, Sportpesa, etc.
        </p>
      </div>
      <div className={styles.aboutContainerInner}>
        <h1>The Importance of Using Prediction Websites.</h1>
        <p>
          433tips.com website is significant as it helps users make informed
          betting decisions by providing predictions and insights on sports
          events. It saves time and effort by offering researched information
          and analysis, allowing users to quickly assess probabilities. The
          expertise of the website&apos;s team enhances users&apos;
          understanding and gives them a competitive edge. It also helps manage
          risks through tools and strategies, covers a wide range of sports and
          markets, and offers tracking and analysis features. Educational
          resources further improve users&apos; betting skills. However,
          predictions are not guaranteed, and responsible gambling practices
          should be followed.
        </p>
      </div>
      <div className={styles.aboutContainerInner}>
        <h1>Advantages of Using A Betting Prediction Website</h1>
        <p>
          A betting prediction website can be of significant importance for
          individuals involved in sports betting or gambling. Here are some
          reasons why such a website holds value: Increased Probability of
          Success: A reliable betting prediction website employs experts and
          analysts who use their knowledge, expertise, and data analysis to make
          informed predictions. This increases the chances of making successful
          bets by providing users with accurate information and insights. Time
          and Effort Saving: Instead of spending hours researching and analyzing
          various factors affecting the outcome of a game or event, users can
          rely on a betting prediction website to provide them with pre-analyzed
          information. This saves time and effort, allowing users to focus on
          placing bets rather than conducting extensive research. Access to
          Expertise: A good betting prediction website usually has a team of
          professionals with years of experience As the gaming season begins,
          harnessing the enthusiasm for sports to enhance one&apos;s financial
          prosperity becomes crucial. This can only be achieved through the
          utilization of the finest forecasting platform worldwide. Those with
          aspirations to turn their visions into actuality are advised to
          explore any of the a for mentioned gambling platforms.
        </p>
      </div>
      <div className={styles.aboutContainerInner}>
        <h1>How to place bets from our website</h1>
        <p>
          We strongly discourage placing all your money on every game listed on
          our platform within a single betting slip. Instead, we recommend
          focusing on 1 to 3 games per bet slip. This approach increases the
          likelihood of achieving profitable outcomes efficiently. For an even
          more exclusive and highly recommended selection of tips, we invite you
          to explore our VIP PLAN section. It provides an opportunity to
          generate substantial returns. By following our recommendations, you
          will embark on a journey of consistent profitability, and we are
          confident that you will never regret choosing 433tips.com. It is
          crucial to note that sports predictions are strictly intended for
          individuals aged 18 years and above, and we do not support illegal
          betting activities. Engaging in sports predictions requires accepting
          the possibility of losses and taking responsibility for your choices.
          While we cannot guarantee a 100% success rate due to factors like
          injuries, red cards, and weather conditions that can impact outcomes,
          our analysis at 433tips.com a success rate of over 98%
        </p>
        <p>
          But there&apos;s more! We make betting thrilling, not boring. Get
          ready for witty banter and laughs! Gear up to unlock VIP betting
          mastery. Our VIP Tips aren&apos;t just predictions; they&apos;re crown
          jewels of sports analysis! Let&apos;s rewrite the playbook together,
          where each tip is treasure and every wager a triumph. Ready for the
          spree? Embrace unmatched victory with 433Tips&apos; VIP Tips! Get your
          VIP ticket now and join the winners&apos; circle.
        </p>
      </div>
      <div className={styles.aboutContainerInner}>
          <h1>Our Betting Links.</h1>
          <p>
            Explore our range of links for free football predictions for major
            bets
          </p>
          <ul>
            <li onclick={() => openTips("free")}>Banker of the day</li>
            <li onclick={() => openTips("vip")}>VIP Tips</li>
            <li onclick={() => openTips("other")}>Other sports</li>
          </ul>
      </div>
    </div>
  );
}
