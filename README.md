# Sign Language Recognition Web Application

An interactive web application for isolated sign language recognition powered by deep learning, designed to promote sign language awareness and support educational initiatives.

**Paper**: "Promoting Sign Language Awareness: A Deep Learning Web Application for Sign Language Recognition"

**DOI**: [https://doi.org/10.1145/3695719.3695723](https://doi.org/10.1145/3695719.3695723)

**Web Application**: [https://deeplearning-lab-csueb.github.io/ASL-webapp/](https://deeplearning-lab-csueb.github.io/ASL-webapp/)

**Dataset**: [Google Isolated Sign Language Recognition on Kaggle](https://kaggle.com/competitions/asl-signs)

## Overview

This project presents a deep learning-based web application that recognizes isolated sign language gestures in real-time. Built with accessibility and education in mind, it serves as a tool for sign language learning, video annotation, and raising broader awareness of sign language communication.

## Key Features

- **Real-time Sign Language Recognition**: Utilizes a trained LSTM (Long Short-Term Memory) model for accurate gesture recognition
- **Interactive Web Interface**: User-friendly design built with React for easy accessibility
- **Educational Purpose**: Supports sign language students, hearing-impaired children, and their families in the learning process
- **Video Annotation Support**: Aids in the annotation of continuous sign language videos
- **Accessibility Focused**: Designed to reduce communication barriers between deaf and hearing communities

## Model Details

- **Primary Model**: LSTM-based architecture with custom feature engineering
- **Dataset**: Google Isolated Sign Language Recognition competition dataset (Kaggle)
- **Performance**: Outperformed baseline LSTM model through feature engineering
- **Comparative Analysis**: Evaluated against transformer-based and CNN-based models

## Built With

- **Frontend Framework**: React (Create React App)
- **Deep Learning**: LSTM model for sign language recognition
- **Language**: JavaScript, Python (model training)

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Usage

1. Launch the application in your web browser
2. Allow camera access when prompted
3. Perform sign language gestures in front of your camera
4. The application will recognize and display the corresponding sign in real-time

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time.

## Citation

If you use this work in your research, please cite:

```bibtex
@inproceedings{sharma2024promoting,
  title={Promoting Sign Language Awareness: A Deep Learning Web Application for Sign Language Recognition},
  author={Sharma, Ayush and Guo, Dongping and Parmar, Arsh and Ge, Jianye and Li, Hongmin},
  booktitle={Proceedings of the 2024 8th International Conference on Deep Learning Technologies (ICDLT)},
  pages={22--28},
  year={2024}
}
```

---

**Note**: This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

For more information about Create React App, check out the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
