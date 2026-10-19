import SEO from "../../components/SEO";

export function NotFound() {
  return (
    <>
      <SEO
        title="Page Not Found — WeatherPro"
        description="The page you are looking for could not be found."
        noIndex
        lang="en"
      />
      <main>
        <h1>404</h1>
        <p>Page not found.</p>
      </main>
    </>
  );
}
