

interface QuranViewerProps {
    verses: any[];
    currentPage: number;
    onPageChange: (page: number) => void;
  }
  
  export default function QuranViewer({ verses, currentPage, onPageChange }: QuranViewerProps) {
    return (
      <div className="quran-viewer">
        <div className="verses">
          {verses.map((verse) => (
            <div key={verse.id} className="verse">
              <div className="arabic">{verse.text_uthmani}</div>
              <div className="translation">{}</div>
            </div>
          ))}
        </div>
  
        {/* <Pagination
          total={Math.ceil(verses.length / 10)}
          initialPage={1}
          page={currentPage}
          onChange={onPageChange}
        /> */}
      </div>
    );
  }