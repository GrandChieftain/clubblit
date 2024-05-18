import randomColor from "randomcolor"
import { memo, useEffect } from "react";
import { useColorDictionary } from "./Search";
import ColorBadge from "../club/ColorBadge";

const SearchResults = memo(function SearchResults({ results }: { results: { name: string, classification: string }[] }){
    const { colors, setColors } = useColorDictionary();
    useEffect(() => {
        for (const { classification } of results){
            if (!(classification in colors)){
                setColors({...colors, [classification]: randomColor({ luminosity: "light", format: 'rgb'})})
            }
        }
    })

    return results.map(({ name, classification }, index) => (
        <div className="flex hover:bg-black/[0.04] dark:hover:bg-white/[0.04] py-1 px-6" key={index}>
            <span className="mr-2">{name}</span>
            <ColorBadge color={colors[classification]} className="ml-auto h-fit whitespace-nowrap">{classification}</ColorBadge>
        </div>
    ));
})

export default SearchResults