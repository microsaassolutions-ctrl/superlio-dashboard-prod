import { useLocation, useNavigate } from 'react-router-dom';
import { generateIcon } from '../../assets/images'
import useMainStore from '../../store/useMainStore';
import { Button, Input } from '../commons';

const ContentGeneration = ({ topic, handleInputChange, handleButtonClick, generating }) => {
    const isGenerating = useMainStore((state) => state.data.isGenerating);
    const isGeneratingCarousel = useMainStore((state) => state.data.isGeneratingCarousel);
    const navigate = useNavigate();
    const {setTopicText} = useMainStore();
    const { state } = useLocation();
    return (
        <div className="container mx-auto w-full flex flex-col items-center mb-5 mt-2">
            <div className="flex items-center justify-center w-[300px] sm:w-[400px] md:w-[600px] lg:w-[800px] bg-white border-2 sm:border-4 border-[#614bfb] rounded-lg overflow-hidden">
                <Input
                    value={topic || ""}
                    onChange={handleInputChange}
                    placeholder="Enter Your Topic Here"
                    className="flex-1 p-3 text-lg outline-none box-border flex-grow min-w-[100px] w-[100%] sm:min-w-[255px] md:min-w-[435px] lg:min-w-[634px]"
                    style={{ border: "none" }}
                />
                <Button
                    type="custom"
                    icon={generateIcon}
                    iconPosition="left"
                    onClick={() => {
                        navigate(".", {
                            state: { ...state,topic:topic, autoGenerate: true, replace: false },
                            replace: true,
                        }); 
                        setTopicText(topic);
                        handleButtonClick()
                    }}
                    className="bg-primary-color text-white p-3 max-w-fit mr-1 sm:max-w-[140px] md:max-w-[150px] text-lg flex items-center gap-2 hover:bg-[#8979FD] transition"
                    disabled={generating || isGenerating || isGeneratingCarousel}
                >
                    {generating || isGenerating ? "Generating" : "Generate"}
                </Button>
            </div>
        </div>
    )
}

export default ContentGeneration