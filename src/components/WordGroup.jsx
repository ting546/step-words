
import WordItem from "./WordItem";
const WordGroup = ({ words, title, description, progressType, onDelete, onChange }) => {
  const filteredWords = words.filter((w) => w.progress === progressType);
  if (!filteredWords.length) return null;

  return (
    <div className="mb-10">
      <h2
        className={`text-2xl mb-2 ${
          progressType === "STUDIED" ? "text-orange-400" : "text-green-400"
        }`}>
        {title} ({filteredWords.length})
      </h2>
      <p className="mb-4">{description}</p>
      {words.map((word, index) => {
        if (word.progress == progressType) {
          return (
            <WordItem
              key={word.id}
              word1={word.word1}
              word2={word.word2}
              onClick={() => onDelete(index)}
              onSendWord={(val, key) => {
                onChange(val, key, index);
              }}
            />
          );
        }
      })}
    </div>
  );
};

export default WordGroup;
