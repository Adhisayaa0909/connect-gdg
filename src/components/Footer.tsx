const Footer = () => (
  <footer className="border-t bg-card mt-auto">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            <span className="h-3 w-3 rounded-full bg-google-blue" />
            <span className="h-3 w-3 rounded-full bg-google-red" />
            <span className="h-3 w-3 rounded-full bg-google-yellow" />
            <span className="h-3 w-3 rounded-full bg-google-green" />
          </div>
          <span className="font-display text-sm font-semibold text-foreground">
            GDG On Campus
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Google Developer Groups. Built with ❤️
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
