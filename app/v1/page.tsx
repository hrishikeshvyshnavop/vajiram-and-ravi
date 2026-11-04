import Hero from "../components/Hero";
import HomePage from "../components/HomePage";
import SiteHeader from "../components/SiteHeader";

// Iteration 1: the frosted header and the four-slide hero with tabs. Listed on the index at /.
export default function HomeV1() {
  return <HomePage header={<SiteHeader />} hero={<Hero />} />;
}
