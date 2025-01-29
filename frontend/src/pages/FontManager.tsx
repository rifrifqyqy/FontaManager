import { useEffect, useState } from 'react';


interface Font {
  font_family: string;
  font_subfamily: string;
  full_name: string;
  version: string;
  postscript_name: string;
  license: string;
}

const FontManager = () => {
  const [fonts, setFonts] = useState<Font[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:5000/fonts')
      .then(response => response.json())
      .then(data => setFonts(data));
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // const handleDelete = async (fontFile: string) => {
  //   try {
  //     const response = await fetch('http://localhost:5000/delete', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ file: fontFile }),
  //     });

  //     const result = await response.json();
  //     console.log(result.message);

  //     // Refresh font list
  //     setFonts(fonts.filter((font) => font.postscript_name !== fontFile));
  //   } catch (error) {
  //     console.error('Error deleting font:', error);
  //   }
  // };

  const filteredFonts = fonts.filter((font) =>
    font.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="">
      <h1 className="text-2xl font-bold text-center my-8 text-light-100">Font License Checker</h1>
      <input
        className="w-full py-2 px-6 mb-4 border text-light-100 placeholder:text-light-500 border-dark-500 rounded-xl"
        type="text"
        placeholder="Search fonts..."
        value={searchQuery}
        onChange={handleSearch}
      />
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {filteredFonts.map((font) => (
          <li key={font.postscript_name} className="bg-dark-300/60 p-6 backdrop-blur-lg border border-dark-500 rounded-xl flex justify-center items-center">
            <div className='flex flex-col gap-8'>
              <header className='flex flex-col items-center gap-2'>
                <h1 className='text-5xl font-regular title-gradient'>
                  Aa
                </h1>
                <article className='text-center  '>
                  <p className='text-light-100 font-semibold text-lg'>{font.full_name}</p>
                  <p className='text-xs text-light-500'>{font.font_family} - {font.font_subfamily}</p>
                </article>

              </header>
              <p className="text-sm max-w-[12em] text-light-300 line-clamp-2 text-center mx-auto">License: {font.license}</p>
              <label htmlFor="" className='mx-auto text-xs bg-pink-300/40 rounded-full px-2 py-1'>{font.version}</label>
            </div>
            {/* <button
              className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
              onClick={() => handleDelete(font.postscript_name)}
            >
              Delete
            </button> */}
          </li>
        ))}
      </ul>
    </main>
  );
};

export default FontManager;
