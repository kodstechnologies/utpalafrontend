import React from 'react'
import Lottie from "lottie-react";
import NoData from '../../public/assets/lottieimages/No-Data.json'

const NoDataFound = () => {
    return (
        <div>
            <Lottie
                animationData={NoData}
                loop
                className="w-64 h-64 mx-auto"
            />
        </div>
    )
}

export default NoDataFound
