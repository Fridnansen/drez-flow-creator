import marca from "@/assets/Marca_en_Español.png.asset.json";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-3xl text-center">
        <img
          src={marca.url}
          alt="Masterdrez - Es más que un ajedrez"
          className="w-full max-w-xl mx-auto drop-shadow-2xl"
        />
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <span className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Proximamente
          </span>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default Index;
