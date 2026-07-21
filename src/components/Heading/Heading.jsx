import "./heading.css";

export const Heading = ({ text }) => {
  return (
    <div className="heading-container">
      <h2 className="heading">{text}</h2>
      <span aria-hidden="true" />
    </div>
  );
};
